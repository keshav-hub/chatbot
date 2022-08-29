import React from "react";

import "./styles.css";
import bot from "../../Images/hiBot1.png";
import { instantiateDemoBot, instantiateModel } from "../../api";

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("profile"));

  const handleChatbot = async () => {
    const response = await instantiateModel(user?.result.id);
    console.log(response);
    if (response.data !== "success") {
      alert("Model Not trained");
    } else window.location = "/chatbot";
  };
  const demoBot = async () => {
    await instantiateDemoBot("0");
    window.location = "/chatbot";
  };

  return (
    <>
      <div className="content">
        <div className="left-content">
          <h1>Welcome to our ChatBot</h1>
          <div className="customContent">
            <h2 className="topic">Take a Demo</h2>
            <button className="btn-primary" onClick={demoBot}>
              Demo Bot
            </button>
          </div>

          <h2 className="topic">Make your custom bot</h2>
          <div className="custom">
            <div className="customContent">
              <h3>Step 1 : Create a Dataset.</h3>
              <button
                className="btn-primary"
                onClick={() => (window.location = "/Questionaire")}
              >
                Create Dataset
              </button>
            </div>
            <div className="customContent">
              <h3>Step 2 : Train Model (Necessary before chatting)</h3>
              <button
                className="btn-primary"
                onClick={() => (window.location = "/trainModel")}
              >
                Train Model
              </button>
            </div>
            <div className="customContent">
              <h3>Step 3 : Let's Start Chatting</h3>
              <button className="btn-primary" id="chat" onClick={handleChatbot}>
                Let's Chat
              </button>
            </div>
          </div>
        </div>
        <div className="right-content">
          <img src={bot} alt="" />
        </div>
      </div>
    </>
  );
};

export default HomePage;
