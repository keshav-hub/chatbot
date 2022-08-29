import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AuthInput from "./AuthInput";
import "./styles.css";
import { signin, signup } from "../../actions/userActions";
import { v4 as uuidv4 } from 'uuid';

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({id:'', firstName:'', lastName:'', emailId:'', password:'', confirmPassword:'' });

  const handleSwitch = (e) => {
      setIsSignIn((prev) => {
          if(prev===true && e!=='signIn')
          return !prev;
          else if(prev===false && e!=='signUp')
          return !prev;
          else
          return prev;
      })
  };

  const handleOnChange = (e) => {
      setUser({...user, [e.target.name]: e.target.value });
  }

  const handleSignIn = (e) => {
    e.preventDefault();
    dispatch(signin(user,navigate));
  }

  const handleSignUp = (e) => {
    e.preventDefault();
    user.id=uuidv4();
    dispatch(signup(user,navigate));
  }

  return (
    <div className="Auth">
        <div className="authContainer">
            <div className="header">
                <div className={isSignIn ? 'h1 glow':'h1'} onClick={() => handleSwitch('signIn')}>Sign In</div>
                <div className={isSignIn ? 'h1':'h1 glow'} onClick={() => handleSwitch('signUp')}>Sign Up</div>
            </div>
        {isSignIn ? (
            <form className="signIn">
                <AuthInput label='Email Id' name='emailId' type='text' size='fullWidth' value={user.emailId} handleOnChange={handleOnChange}/>
                <AuthInput label='Password' name='password' type='password' size='fullWidth' value={user.password} handleOnChange={handleOnChange}/>
                <button className="btn-primary-submit" onClick={handleSignIn}>Submit</button>
            </form>
        ) : (
            <form className="signUp">
                <div className="userName">
                <AuthInput label='First Name' name='firstName' type='text' size='half' value={user.firstName} handleOnChange={handleOnChange}/>
                <AuthInput label='Last Name' name='lastName' type='text' size='half' value={user.lastName} handleOnChange={handleOnChange}/>
                </div>
                <AuthInput label='Email Id' name='emailId' type='text' size='fullWidth' value={user.emailId} handleOnChange={handleOnChange}/>
                <AuthInput label='Password' name='password' type='password' size='fullWidth' value={user.password} handleOnChange={handleOnChange}/>
                <AuthInput label='Confirm Password' name='confirmPassword' type='password' size='fullWidth' value={user.reenterPassword} handleOnChange={handleOnChange}/>
                <button className="btn-primary-submit" onClick={handleSignUp}>Submit</button>
            </form>
        )}
        </div>
    </div>
  );
};

export default Auth;
