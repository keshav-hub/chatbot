import fs from 'fs';
import axios from 'axios';

const dataPath = './Data/Dataset.json';
const baseUrl = `http://localhost:5000`;

const getDataList = () => {
    const jsonData = fs.readFileSync(dataPath);

    return JSON.parse(jsonData);
}

const paramsPath = './Data/hyperparams.json';

const getParamsList = () => {
    const jsonData = fs.readFileSync(paramsPath);

    return JSON.parse(jsonData);
}

const getData = async (id) => {
    const dataList = await getDataList();
    var data = dataList["1"];
    var userData = undefined;
    if(id !== undefined ) userData = dataList[id];

    if(userData !== undefined && id!=="1" && id!=="0")
    {
        for (const tag in userData) {
            var existingContent = data[tag];
            var {patterns, responses} = userData[tag];
            if(existingContent===undefined)
            {
                existingContent = { patterns: [], responses: []};
            } 
            patterns.map(pattern => {
                existingContent.patterns = existingContent.patterns.filter(i => i!==pattern);
                existingContent.patterns.push(pattern);
            })
            responses.map(response => {
                existingContent.responses = existingContent.responses.filter(i => i!==response);
                existingContent.responses.push(response);
            })
            data[tag] = existingContent;
        }
    }
    return data;
}

export const trainModel = async (req, res) => {
    var id = req.params.id;

    try {
        var data = await getData(id);

        if(id === undefined)id='1';

        const hyperparams = await getParamsList();

        for(const tag in hyperparams)
        {
            hyperparams[tag]=parseInt(hyperparams[tag]);
        }

        const dataset = ({id, data, hyperparams});

        const response = await axios.post(`${baseUrl}/train`, dataset);
        res.status(200).json(response.data);
    } catch (error) {
        console.log("failure")
        res.status(500).json('failure');
    }
}

export const instantiateDemoBot = async (req,res) => {
    var id = req.params.id;

    try {
        const dataList = await getDataList();
        var data = dataList["0"];

        const hyperparams = {
            "BatchSize": 16,
            "LearningRate": 2e-3,
            "NumberOfEpochs": 1500,
            "NeuronsInHiddenLayer": 16,
            "DepthOfModel": 3
        }
        const response = await axios.post(`${baseUrl}/instantiate`, { id, data, hyperparams });
        
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json("Something went wrong");
    }
}

export const instantiateModel = async (req, res) => {
    var id = req.params.id;

    try {
        var data = await getData(id);

        if(id ===  undefined) id="1";

        const hyperparams = await getParamsList();

        for(const tag in hyperparams)
        {
            hyperparams[tag]=parseInt(hyperparams[tag]);
        }

        const response = await axios.post(`${baseUrl}/instantiate`, { id, data, hyperparams });
        
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const predictReply = async (req, res) => {
    const {statement} = req.body;
    try {
        const reply = await axios.post(`${baseUrl}/predict`, { "message": `${statement}` });

        res.status(200).json(reply.data.response);

    } catch (error) {
        res.status(500).json(error);
    }
}