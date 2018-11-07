import React, { Component } from 'react';
import logo from './logo.svg';
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import TopLogin from "./components/TopLogin/TopLogin";
import Moment from 'moment';
import ReactModalLogin from 'react-modal-login';
import { googleConfig } from "./social-config";
import API from "./api/user"
import './App.css';


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dateFormatted: Moment().format('MMMM Do YYYY, h:mm:ss a').toString(),
            username: "",
            password: "",
            email: "",
            showModal: false,
            loggedIn: null,
            loading: false,
            error: null,
            initialTab: null,
            recoverPasswordSuccess: null,
        };

        this.clockTick = this.clockTick.bind(this);
    }

    // Clock/Date related methods
    clockTick = () => {
        this.setState({
            dateFormatted: Moment().format('dddd Do MMMM YYYY HH:mm:ss').toString()
        })
    }

    componentDidMount() {
        this.interval = setInterval(this.clockTick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    // React Modal Login related methods
    onLogin() {
        console.log('__onLogin__');
        console.log('login: ' + document.querySelector('#login').value);
        console.log('password: ' + document.querySelector('#password').value);

        const login = document.querySelector('#login').value;
        const password = document.querySelector('#password').value;

        if (!login || !password) {
            this.setState({
                error: true
            })
        } else {
            const newUserData = { username: login, password: password };

            console.log("onLogin - testing newUserData");
            console.log(newUserData);
            console.log("========\n");

            console.log("sending user data to backend to verify log in");
            API.login(newUserData).then((response) => {
                console.log("Here's the response:");
                console.log(response);

                if (response.data) {
                    console.log("Response Passed:  ");
                    console.log(response);
                    this.onLoginSuccess('form', response);
                    this.setState({
                        username: login,
                        password: password
                    })

                } else {
                    console.log("Response failed:  ");
                    console.log(response);
                    this.onLoginFail('form', response);
                }
            });
        }
    }

    onLogOut() {
        console.log('__onLogOut__');

        this.setState({
            username: "",
            password: "",
            email: "",
            showModal: false,
            loggedIn: null,
            loading: false,
            error: null,
            initialTab: null,
            recoverPasswordSuccess: null
        })

    }

    onRegister() {
        console.log('__onRegister__');
        console.log('login: ' + document.querySelector('#login').value);
        console.log('email: ' + document.querySelector('#email').value);
        console.log('password: ' + document.querySelector('#password').value);

        const login = document.querySelector('#login').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        if (!login || !email || !password) {
            this.setState({
                error: true
            })
        } else {
            const newUserData = { username: login, password: password, email: email };

            console.log("testing newUserData");
            console.log(newUserData);
            console.log("========");
            API.newUser(newUserData).then((response) => {
                console.log(response);
                this.onLoginSuccess('form');
                this.setState({
                    username: login,
                    email: email,
                    password: password
                })
            });
        }
    }

    onRecoverPassword() {
        console.log('__onFotgottenPassword__');
        console.log('email: ' + document.querySelector('#email').value);

        const email = document.querySelector('#email').value;


        if (!email) {
            this.setState({
                error: true,
                recoverPasswordSuccess: false
            })
        } else {
            this.setState({
                error: null,
                recoverPasswordSuccess: true
            });
        }
    }

    openModal(initialTab) {
        this.setState({
            initialTab: initialTab
        }, () => {
            this.setState({
                showModal: true,
            })
        });
    }

    onLoginSuccess(method, response) {
        console.log("onLoginSuccess function called");
        console.log('logged successfully with ' + method);

        this.closeModal();
        this.setState({
            loggedIn: method,
            loading: false
        })
    }

    onLoginFail(method, response) {
        console.log('logging failed with ' + method);
        console.log("testing response");
        console.log(response);
        this.setState({
            loading: false,
            error: response
        })
    }

    startLoading() {
        this.setState({
            loading: true
        })
    }

    finishLoading() {
        this.setState({
            loading: false
        })
    }

    afterTabsChange() {
        this.setState({
            error: null,
            recoverPasswordSuccess: false,
        });
    }

    closeModal() {
        this.setState({
            showModal: false,
            error: null
        });
    }

    render() {
        const date = this.state.dateFormatted;

        const loggedIn = this.state.loggedIn
            ? <div>
                <p>You are signed in with: {this.state.loggedIn}</p>
            </div>
            : <div>
                <p>You are signed out</p>
            </div>;

        const isLoading = this.state.loading;

        return (
            <div className="App">
                <Navbar />
                <TopLogin
                    dateNow={date}
                    loggedIn={this.state.loggedIn}
                    username={this.state.username}
                    login={() => this.openModal('login')}
                    logoff={() => this.onLogOut()}
                    register={() => this.openModal('register')}
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
                    {isLoading}
                </header>
                <ReactModalLogin

                    
                    visible={this.state.showModal}
                    onCloseModal={this.closeModal.bind(this)}
                    loading={this.state.loading}
                    initialTab={this.state.initialTab}
                    error={this.state.error}
                    tabs={{
                        afterChange: this.afterTabsChange.bind(this)
                    }}
                    loginError={{
                        label: "Couldn't sign in, please make sure you typed in your username and password correctly."
                    }}
                    registerError={{
                        label: "Couldn't sign up, please try again."
                    }}
                    startLoading={this.startLoading.bind(this)}
                    finishLoading={this.finishLoading.bind(this)}
                    form={{
                        onLogin: this.onLogin.bind(this),
                        onRegister: this.onRegister.bind(this),
                        onRecoverPassword: this.onRecoverPassword.bind(this),

                        recoverPasswordSuccessLabel: this.state.recoverPasswordSuccess
                            ? {
                                label: "New password has been sent to your mailbox!"
                            }
                            : null,
                        recoverPasswordAnchor: {
                            label: "Forgot your password?"
                        },
                        loginBtn: {
                            label: "Sign in"
                        },
                        registerBtn: {
                            label: "Sign up"
                        },
                        recoverPasswordBtn: {
                            label: "Send new password"
                        },
                        loginInputs: [
                            {
                                containerClass: 'RML-form-group',
                                label: 'Username',
                                type: 'text',
                                inputClass: 'RML-form-control',
                                id: 'login',
                                name: 'username',
                                placeholder: 'Username',
                            },
                            {
                                containerClass: 'RML-form-group',
                                label: 'Password',
                                type: 'password',
                                inputClass: 'RML-form-control',
                                id: 'password',
                                name: 'password',
                                placeholder: 'Password',
                            }
                        ],
                        registerInputs: [
                            {
                                containerClass: 'RML-form-group',
                                label: 'Username',
                                type: 'text',
                                inputClass: 'RML-form-control',
                                id: 'login',
                                name: 'username',
                                placeholder: 'Username',
                            },
                            {
                                containerClass: 'RML-form-group',
                                label: 'Email',
                                type: 'email',
                                inputClass: 'RML-form-control',
                                id: 'email',
                                name: 'email',
                                placeholder: 'Email',
                            },
                            {
                                containerClass: 'RML-form-group',
                                label: 'Password',
                                type: 'password',
                                inputClass: 'RML-form-control',
                                id: 'password',
                                name: 'password',
                                placeholder: 'Password',
                            }
                        ],
                        recoverPasswordInputs: [
                            {
                                containerClass: 'RML-form-group',
                                label: 'Email',
                                type: 'email',
                                inputClass: 'RML-form-control',
                                id: 'email',
                                name: 'email',
                                placeholder: 'Email',
                            },
                        ],
                    }}
                    separator={{
                        label: "or"
                    }}
                    providers={{
                        google: {
                            config: googleConfig,
                            onLoginSuccess: this.onLoginSuccess.bind(this),
                            onLoginFail: this.onLoginFail.bind(this),
                            inactive: isLoading,
                            label: "Continue with Google"
                          }
                    }}
                />
                {loggedIn}
                <Footer />
            </div>
        );
    }
}

export default App;
