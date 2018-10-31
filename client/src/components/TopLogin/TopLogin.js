import React from "react";
import './TopLogin.css';

const TopLogin = () => {
  return (
    <div className="row" id="loginRow">
    <div className="container">
        <span id="timeSpan">Time</span>
        <a className="float-right" id="loginLink" href="#">Login</a>
    </div>
  </div>
  );
};

export default TopLogin;
