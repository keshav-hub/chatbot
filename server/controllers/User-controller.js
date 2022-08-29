import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const dataPath = './Data/users.json';

const getUserList = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
}
const saveUserList = (data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync(dataPath, stringifyData);
}

export const getUsers = async (req,res) => {
    try {
        const userList = getUserList();
        res.send(userList);
    } catch (error) {
        res.send({message: error});
    }
}
 export const signin = async (req,res) => {
    const { emailId, password } = req.body;

    try {
        const UserList = getUserList();

        const index = UserList.findIndex((user) => user.emailId===emailId);

        if(index===-1) return res.status(404).json({ message: `User doesn't exist`});

        const isPasswordCorrect = await bcrypt.compare( password, UserList[index].password);

        if(!isPasswordCorrect) return res.status(400).json({ message: `Invalid Credentials.` });

        const token = jwt.sign({ emailId: UserList[index].emailId, id: UserList[index].id }, 'test', { expiresIn: "1h"});

        res.status(200).json({ result: UserList[index], token });
    } catch (error) {
        res.status(500).json('something went wrong');
    }
 }

export const signup = async (req, res) => {
    const { id, firstName, lastName, emailId, password, confirmPassword } = req.body;

    try {
        const userList = getUserList();

        const index = userList.findIndex((user) => user.emailId===emailId);
        
        if(index!==-1) return res.status(400).json({ index,message: 'User already exist.'});

        if(password!==confirmPassword) return res.status(400).json({ message: `Credentials doesn't match.`});

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = { id:id, firstName: firstName, lastName: lastName, emailId:emailId, password:hashedPassword};
        userList.push(result);
        saveUserList(userList);

        const token = jwt.sign({ emailId: emailId, id: id}, 'test', { expiresIn: "1h" });

        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json('something went wrong');
    }
}