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
            firstName: "",
            lastName: "",
            password: "",
            email: "",
            profilePicURL: "",
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
        console.log("testing state");
        console.log(this.state);
        console.log("we are in:  " + process.env.NODE_ENV + " mode");
        console.log("testing process.env:  ");
        console.log(process.env);
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
            firstName: "",
            lastName: "",
            password: "",
            email: "",
            profilePicURL: "",
            showModal: false,
            loggedIn: null,
            loading: false,
            error: null,
            initialTab: null,
            recoverPasswordSuccess: null,
        })

        if (this.state.loggedIn === 'google') {
            // Signs out the Google user
            window.gapi.auth2.getAuthInstance().signOut();
        }

    }

    onRegister() {
        console.log('__onRegister__');
        console.log('login: ' + document.querySelector('#login').value);
        console.log('first name: ' + document.querySelector('#firstName').value);
        console.log('last name: ' + document.querySelector('#lastName').value);
        console.log('email: ' + document.querySelector('#email').value);
        console.log('password: ' + document.querySelector('#password').value);

        const login = document.querySelector('#login').value;
        const firstName = document.querySelector('#firstName').value;
        const lastName = document.querySelector('#lastName').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        if (!login || !email || !password) {
            this.setState({
                error: true
            })
        } else {
            const newUserData = {
                firstname: firstName,
                lastname: lastName,
                email: email,
                local: {
                    username: login,
                    password: password
                }
            };

            console.log("testing newUserData");
            console.log(newUserData);
            console.log("====================");

            API.newUser(newUserData).then((response) => {
                console.log(response);
                this.onLoginSuccess('form');
                this.setState({
                    username: login,
                    firstName: firstName,
                    lastName: lastName,
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
        console.log("console logging out the response");
        // console.log(JSON.stringify(response));
        console.log(response);

        if (method === 'google') {
            console.log("sign in with google is a success, attempting to get basic profile data now");
            const googleUser = window.gapi.auth2.getAuthInstance().currentUser.get();
            const profile = googleUser.getBasicProfile();

            console.log("testing googleUser var");
            console.log(googleUser);
            console.log("testing profile var");
            console.log(profile);
            console.log('ID: ' + profile.getId() + "\n"
                + 'Name: ' + profile.getName() + "\n"
                + 'Image URL: ' + profile.getImageUrl() + "\n"
                + 'Email: ' + profile.getEmail());
            // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            // console.log('Name: ' + profile.getName());
            // console.log('Image URL: ' + profile.getImageUrl());
            // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

            // console.log("calling calendar related function - listUpcomingEvents()");
            // this.listUpcomingEvents();

            // this.loadGoogleCalendarClient();
            // this.getCalendarInfo();

            this.onSignIn(googleUser);

            this.closeModal();
            this.setState({
                username: profile.getName(),
                email: profile.getEmail(),
                profilePicURL: profile.getImageUrl(),
                loggedIn: method,
                loading: false

            })
        } else {

            this.closeModal();
            this.setState({
                loggedIn: method,
                loading: false
            })
        }
    }

    onSignIn(googleUser) {
        console.log("Beginning process of authenticating Google user via token id");
        const id_token = googleUser.getAuthResponse().id_token;

        console.log("testing id_token var:  " + id_token);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/tokensignin');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            console.log('Signed in as: ' + xhr.responseText);
        };
        xhr.send('idtoken=' + id_token);
    }

    // getEvents() {
    //     let that = this;
    //     function start() {
    //         gapi.client.init({
    //             'apiKey': GOOGLE_API_KEY
    //         }).then(function () {
    //             return gapi.client.request({
    //                 'path': `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
    //             })
    //         }).then((response) => {
    //             let events = response.result.items
    //             that.setState({
    //                 events
    //             }, () => {
    //                 console.log(that.state.events);
    //             })
    //         }, function (reason) {
    //             console.log(reason);
    //         });
    //     }
    //     gapi.load('client', start)
    // }

    loadGoogleCalendarClient() {
        return window.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
            .then(
                function () {
                    console.log("GAPI client loaded for API");
                },
                function (err) {
                    console.error("Error loading GAPI client for API", err);
                }
            );
    }

    getCalendarInfo() {
        console.log("getCalendarInfo function called");
        return window.gapi.client.calendar.calendarList.list({})
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
            },
                function (err) { console.error("Execute error", err); });
    }


    onLoginFail(method, response) {
        console.log('logging failed with ' + method);
        console.log("testing failed response");
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


    // Calendar related functions

    appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
    }

    listUpcomingEvents() {
        window.gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        }).then(function (response) {
            var events = response.result.items;
            this.appendPre('Upcoming events:');

            if (events.length > 0) {
                for (let i = 0; i < events.length; i++) {
                    var event = events[i];
                    var when = event.start.dateTime;
                    if (!when) {
                        when = event.start.date;
                    }
                    this.appendPre(event.summary + ' (' + when + ')')
                }
            } else {
                this.appendPre('No upcoming events found.');
            }
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
                    {loggedIn}
                    <p>Google Calendar API Quickstart</p>
                    <div id="content">
                    </div>
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
                                label: 'Firstname',
                                type: 'text',
                                inputClass: 'RML-form-control',
                                id: 'firstName',
                                name: 'firstname',
                                placeholder: 'First Name',
                            },
                            {
                                containerClass: 'RML-form-group',
                                label: 'Lastname',
                                type: 'text',
                                inputClass: 'RML-form-control',
                                id: 'lastName',
                                name: 'lastname',
                                placeholder: 'Last Name',
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
                <Footer />
            </div>
        );
    }
}

export default App;
