import React,{ useState } from 'react';

import './styles.css';

const Form = ({ formData, setFormData, tags, setTags }) => {
    const [formItem, setFormItem] = useState({tag:'', pattern:'', response:''});

    const handleAddItem = () => {
        const { tag, pattern, response } = formItem;
        
        var tagList = tags;
        tagList = tagList.filter(i => i!==tag);
        tagList.push(tag);
        setTags(tagList);

        var data = formData[tag];
        if(data === undefined)
        {
            data={
                patterns: [],
                responses: []
            }
        }
        data.patterns = data.patterns.filter((item) => (item !== pattern));
        data.patterns.push(pattern);

        data.responses = data.responses.filter((item) => (item !== response));
        data.responses.push(response);
        formData[tag]=data;
        setFormData({...formData});
    }

    return (
        <div className="form">
            <div className="formItem">
            <div className="leftItem">
                <label htmlFor="category">Category:</label>
                <select id="select" name="category" onChange={(e) => setFormItem({...formItem, tag: e.target.value})}>
                    <option value="Choose a category">Choose a category...</option>
                <option value="greeting" >Greeting</option>
                <option value="goodbye" >Goodbye</option>
                <option value="thanks" >Thanks</option>
                <option value="help" >Help</option>
                </select>
            </div>
            <div className="rightItem">
                <label htmlFor="pattern">Other Category (If not in list)*</label>
                <input type="text" id='category' value={formItem.tag} onChange={(e) => setFormItem({...formItem, tag: e.target.value})} required/>
            </div>
            </div>
            
            <div className="formItem">
            <div className="leftItem">
                <label htmlFor="pattern">Statement</label>
                <input type="text" id='statement'  value={formItem.pattern} onChange={(e) => setFormItem({...formItem, pattern: e.target.value})}/>
            </div>
            <div className="rightItem">
                <label htmlFor="pattern">Reply</label>
                <input type="text" id='reply' value={formItem.response} onChange={(e) => setFormItem({...formItem, response: e.target.value})}/>
            </div>
            </div>
            <button className="addItem" id='addItem' onClick={handleAddItem}>Add</button>
        </div>
    )
}

export default Form;
