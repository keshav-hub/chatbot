import React from 'react'
import './styles.css';

const Chat = ({item}) => {
    return (
        <div id={item.id} className='message' style={{ display: 'flex', flexDirection: `${item.flexDirection}`}}>
            <div className={item.isUser ? 'messageContent right' : 'messageContent left'}>
                <h3>{item.statement}</h3>
            </div>
        </div>
    )
}

export default Chat
