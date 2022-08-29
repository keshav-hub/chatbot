import fs from 'fs';
const dataPath = './Data/Dataset.json';

const getDataList = () => {
    const jsonData = fs.readFileSync(dataPath);

    return JSON.parse(jsonData);
}
const saveDataList = (data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync(dataPath, stringifyData);
}

export const updateData = async (req, res) => {
    const { tags, data } = req.body;
    const id = req.params.id;

    console.log(id, tags, data);

    try {
        var dataList = await getDataList();
        var existingData = dataList[id];

        if(existingData===undefined)
        {
            dataList[id]=data;
            saveDataList(dataList);
            res.status(201).json('success');
        }
        tags.map((tag) => {
            var existingContent = existingData[tag];
            var {patterns, responses} = data[tag];
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
            existingData[tag] = existingContent;
        })
        dataList[id] = existingData;
        await saveDataList(dataList);
        res.status(201).json('success');
    } catch (error) {
        res.send(error);
    }
}

const paramsPath = './Data/hyperparams.json';

const saveParamsList = (data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync(paramsPath, stringifyData);
}

export const updateParams = async (req, res) => {
    const formData = req.body;

    try {
        await saveParamsList(formData);
        res.send({ success: true });
    } catch (error) {
        res.send(error);
    }
}