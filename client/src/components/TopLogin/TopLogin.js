import React from "react";
import './TopLogin.css';

const TopLogin = (props) => {
  return (
    <div className="row" id="loginRow">
      <div className="container">
        <span id="timeSpan">{props.dateNow}</span>
        {!props.loggedIn && <a className="float-right" id="signUpLink" href="#" onClick={props.register}>Sign Up</a>}
        {!props.loggedIn && <a className="float-right" id="loginLink" href="#" onClick={props.login}>Login</a>}
        {props.loggedIn && <a className="float-right" id="logOutLink" href="#" onClick={props.logOut}>Log Out</a>}

        {props.loggedIn && <p className="float-right">Hello, {props.username} </p> }
      </div>
    </div>
  );
};

export default TopLogin;
