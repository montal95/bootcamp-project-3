import React, { Component } from 'react';
import logo from './logo.svg';
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import TopLogin from "./components/TopLogin/TopLogin";
import Modal from "./components/Modal/Modal";
import Moment from 'moment';
import './App.css';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dateFormatted : Moment().format('MMMM Do YYYY, h:mm:ss a').toString()
        };
        this.clockTick = this.clockTick.bind(this);
    }

    clockTick = () => {
        this.setState({
            dateFormatted : Moment().format('dddd Do MMMM YYYY HH:mm:ss').toString()
        })
    }

    componentDidMount() {
        this.interval = setInterval(this.clockTick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const date = this.state.dateFormatted;

        return (
            <div className="App">
                <Navbar />
                <TopLogin
                    dateNow={date}
                />
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
