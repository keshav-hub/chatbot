import React,{ useState } from 'react';
import { submitParams, trainModel } from '../../api';
import Loading from '../Loading/Loading';

import './styles.css';

const Train = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const [isLoading, setIsLoading] = useState(false);

    const defaultParams = {
        BatchSize : 16,
        LearningRate : 0.002,
        NumberOfEpochs : 1500,
        NeuronsInHiddenLayer : 16,
        DepthOfModel: 4,
    };
    
    const [customParams, setCustomParams] = useState({
        BatchSize : '',
        LearningRate : '',
        NumberOfEpochs : '',
        NeuronsInHiddenLayer : '',
        DepthOfModel: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(document.getElementById('dataId').checked)
        await submitParams(defaultParams);
        else
        await submitParams(customParams);

        console.log("submitted");
        setIsLoading(true);
        await trainModel(user?.result.id);
        // console.log(data);
        setIsLoading(false);
        // window.location='/';
    }

    const onFormFieldChange = (e) => {
        setCustomParams({
          ...customParams,
          [e.target.name]: e.target.value 
        })
     }

    const handleDefaultParam = () => {
        const cb = document.getElementById('dataId');
        if(cb.checked)
        {
            document.getElementById('batchsize').disabled = true;
            document.getElementById('rate').disabled = true;
            document.getElementById('epoch').disabled = true;
            document.getElementById('layer').disabled = true;
            document.getElementById('depth').disabled=true;

        }
        else
        {
            document.getElementById('batchsize').disabled = false;
            document.getElementById('rate').disabled = false;
            document.getElementById('epoch').disabled = false;
            document.getElementById('layer').disabled = false;
            document.getElementById('depth').disabled = false;
        }
    }

    return (
        <>
        <div className='train'>
            <div className="trainContainer">
            <div className="title">
                    Enter Hyper-Parameters according to the Dataset
            </div>
            <form className='hyperParameters'onSubmit={handleSubmit}>
                <div className="input">
                    <label htmlFor="batchSize">Batch Size</label>
                    <input name='BatchSize' type="number" id='batchsize' value={customParams.BatchSize} onChange={onFormFieldChange} required />
                </div>
                <div className="input">
                    <label htmlFor="batchSize">Learning Rate</label>
                    <input name='LearningRate' type="number" id='rate' value={customParams.LearningRate} onChange={onFormFieldChange} required/>
                </div><div className="input">
                    <label htmlFor="batchSize">No. of Epochs</label>
                    <input name='NumberOfEpochs' type="number" id="epoch" value={customParams.NumberOfEpochs} onChange={onFormFieldChange} required />
                </div><div className="input">
                    <label htmlFor="batchSize">Neurons in hidden layer</label>
                    <input name='NeuronsInHiddenLayer' type="number" id="layer" value={customParams.NeuronsInHiddenLayer} onChange={onFormFieldChange} required />
                </div><div className="input">
                    <label htmlFor="batchSize">Depth of model</label>
                    <input name='DepthOfModel' type="number" id="depth" value={customParams.DepthOfModel} onChange={onFormFieldChange} required />
                </div>
                <label htmlFor="default" className='checkBox'>
                    <input type="checkbox" id="dataId" name="default" value="yes" onClick={handleDefaultParam}/> Use Default Params
                </label>
                <button className='btn-primary-submit' type='submit'>Train</button>
            </form>
            </div>
            {isLoading && <Loading />}
        </div>
        </>
    )
}

export default Train