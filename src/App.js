import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import TopLogin from "./components/TopLogin/TopLogin";

class App extends Component {
  render() {
    return (
      <div>
        <TopLogin />
        <Navbar />
        <Footer />
      </div>
    );
  }
}

export default App;
