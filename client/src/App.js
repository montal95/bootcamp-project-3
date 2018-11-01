import React, { Component } from 'react';
import logo from './logo.svg';
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import TopLogin from "./components/TopLogin/TopLogin";
import Modal from "./components/Modal/Modal";
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Navbar />
                <TopLogin />
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
                <Footer />
            </div>
        );
    }
}

export default App;
