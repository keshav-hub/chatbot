import React from 'react';
import './styles.css';
import loading from '../../Images/spinner.gif';

const Loading = () => {
    return (
        <div className='loading'>
            <div className="loadingContent">
                <h2>Please wait for a moment</h2>
                <img src={loading} alt="loading" />
                <h3>while the bot is under training...</h3>
            </div>
        </div>
    )
}

export default Loading
