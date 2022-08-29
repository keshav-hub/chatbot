import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import "./styles.css";
import HomePage from "./components/HomePage/HomePage";
import FormPage from "./components/Questionaire/FormPage";
import ChatBot1 from "./components/ChatBot/Chatbot1";
import Auth from "./components/Auth/Auth";
import Train from "./components/Train/Train";
import About from "./components/About/About";

const App = () => {
  return (
    <BrowserRouter>
      <div id="Home" className="Home">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/questionaire" element={<FormPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/chatbot" element={<ChatBot1 />} />
          <Route path="/trainModel" element={<Train />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
