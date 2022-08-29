import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import decode from "jwt-decode";

import { LOGOUT } from "../../constants/actionTypes";
import logo from "../../Images/logo2.png";
import avatar from "../../Images/avatar2.png";
import "./styles.css";

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [menuBar, setMenuBar] = useState("0vw");

  const dispatch = useDispatch();
  const location = useLocation();

  const logout = () => {
    dispatch({ type: LOGOUT });
    window.location = "/";
    setUser(null);
  };

  const handleMenuBar = () => {
    setMenuBar((prev) => (prev === "0vw" ? "355px" : "0vw"));
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
    setUser(JSON.parse(localStorage.getItem("profile")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className="Navbar">
      <div className="leftbar">
        <h1>ChatBot</h1>
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div className="rightbar">
        {/* {user?.result ? (
                <><div className="user">
                    <img src={avatar} alt="" />
                    <h3>Hi, {user.result.firstName} {user.result.lastName}</h3>
                </div><button className='btn-secondary' onClick={logout}>Logout</button></>):
            (<Link to='/auth'><button className='btn-secondary'>Login</button></Link>)} */}
      </div>
      <div className="menuBar" style={{ width: menuBar }}>
        <div className="close" onClick={handleMenuBar}>
          <h1 className="close">+</h1>
        </div>
        <div className="profile">
          {user?.result && (
            <>
              <img src={avatar} alt="" />
              <h3>
                {user.result.firstName} {user.result.lastName}
              </h3>
              <h4>{user.result.emailId}</h4>
            </>
          )}
        </div>
        <div className="menu">
          <Link to="/" onClick={handleMenuBar}>
            &rarr; Home
          </Link>
          <Link to="/Questionaire" onClick={handleMenuBar}>
            &rarr; Create Dataset
          </Link>
          <Link to="/trainModel" onClick={handleMenuBar}>
            &rarr; Train Model
          </Link>
          <Link to="/Chatbot" onClick={handleMenuBar}>
            &rarr; Let's Chat
          </Link>
        </div>
        <div className="signInUp">
          {user?.result ? (
            <button className="btn-secondary1" onClick={logout}>
              Logout
            </button>
          ) : (
            <Link to="/auth">
              <button className="btn-secondary1" onClick={handleMenuBar}>
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="hamburger" onClick={handleMenuBar}>
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </div>
    </div>
  );
};

export default Navbar;
