import React from 'react';
import './styles.css';

const FormContent = ({formData, setFormData,tags, setTags}) => {

    const deleteItem = (obj) => {
        const { tag, pattern, response } = obj;
        var data = formData[tag];
        data.patterns = data.patterns.filter((item) => item!==pattern);
        data.responses = data.responses.filter((item) => item!==response);
        if(data.patterns.length===0 && data.responses.length===0)
        {
          setTags(old => old.filter(i => i!==tag));
        }
        formData[tag] = data;
        setFormData({...formData});
      }
      
    return (
        <div className="inputStatus">
          <h2>You have added :-</h2>
          {(tags.length>0) ? (tags.map((item,index) => (formData[item].responses.length!==0 || formData[item].patterns.length!==0) && (<div key={index} className="item">
            <h3>Tag : {item}</h3>
            <div className="itemContent">
              <div className="statements">
                <h3>Statements</h3>
                <ol className="innerBox">
                {formData[item].patterns.map((i) => (<li key={i}>{i} <div className="deleteItem" onClick={() => deleteItem({tag:item, pattern:i,response:''})}>+</div></li>))}
                </ol>
              </div>
              <div className="replys">
                <h3>Reply's</h3>
                <ol className="innerBox">
                {formData[item].responses.map((i) => (<li key={i}>{i} <div className="deleteItem" onClick={() => deleteItem({tag:item, pattern:'',response:i})}>+</div></li>))}
                </ol>
              </div>
            </div>
          </div>))): (<h3>No items to display.</h3>)}
      </div>
    )
}

export default FormContent;
