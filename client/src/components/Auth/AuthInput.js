import React from 'react';
import './styles.css';

const AuthInput = ({ label, name, type, size, value, handleOnChange }) => {
    return (
        <div className='AuthInput' style={{ display:`flex`, flexDirection:'column', width:`${(size==='half') ? '50%':'100%'}`}} >
            <label htmlFor={label}>{label}</label>
            <input name={name} type={type} value={value} onChange={handleOnChange} />
        </div>
    )
}

export default AuthInput
