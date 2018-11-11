import React, { Component } from 'react';
import logo from './logo.svg';
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import TopLogin from "./components/TopLogin/TopLogin";
import CardContainer from "./components/CardContainer";
import PlanCard from "./components/PlanCard";
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
            userId: "",
            username: "",
            password: "",
            email: "",
            showModal: false,
            loggedIn: null,
            loading: false,
            error: null,
            initialTab: null,
            recoverPasswordSuccess: null,
            plans:[],
            plansLoaded:false
        };

        this.clockTick = this.clockTick.bind(this);
    }

    // Clock/Date related methods
    clockTick = () => {
        this.setState({
            dateFormatted: Moment().format('dddd Do MMMM YYYY h:mm A').toString()
        })
        if(this.state.plansLoaded){
            this.handlePlans();
        }
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
                    console.log(`State after login success function: \n ${JSON.stringify(this.state)}`);
                    console.log(`State before we get plans: ${JSON.stringify(this.state)}`);
                    this.getPlans(this.state.username);
                    console.log(this.state);

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
            userId:"",
            username: "",
            password: "",
            email: "",
            showModal: false,
            loggedIn: null,
            loading: false,
            error: null,
            initialTab: null,
            recoverPasswordSuccess: null,
            plans:[],
            plansLoaded:false
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
        console.log('__onForgottenPassword__');
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

    getPlans(username) {
        console.log(`${username} for get plans api`);
        API.getInfo(username).then((response)=>{
            console.log(response);
            this.setState({
                "userId":response.data.id,
                "plans":response.data.plan
            }, ()=>{
                console.log(this.state);
                console.log("=================");
                console.log("All User info retrieved");
                this.handlePlans();
            });
        })
    }

    handlePlans(){
        let userPlans = (this.state.plans).sort((a,b)=>a.startTime > b.startTime ? 1 : -1);
        console.log("This is sorted plan");
        console.log(userPlans);
        userPlans.forEach(plan => {
            let minutes = ((Moment().diff(plan.startTime, 'minutes'))*-1) % 60;
            let seconds = ((Moment().diff(plan.startTime, 'seconds'))*-1) % 60;
            let hours = ((Moment().diff(plan.startTime, 'hours'))*-1)%24;
            let days = ((Moment().diff(plan.startTime, 'hours')));
            if(days > 0){
                return plan.timeUntil = false;
            }
            plan.timeUntil=`${hours > 0 ? `${hours< 10 ? `0${hours}`: hours}:` : ""}${minutes}:${seconds<10 ? "0":""}${seconds}`;
        });
        userPlans.forEach(plan => plan.startTime = Moment(plan.startTime).format('h:mm A, M/D/YY').toString());
        console.log("Time until added");
        console.log(userPlans);
        this.setState({
            "plans":userPlans,
            "plansLoaded":true
        }, ()=>{
            console.log("Plans Handled");
            console.log(this.state.plans);
        })
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

        const plansLoaded = this.state.plansLoaded
            ? <div>
                <CardContainer>
                    {this.state.plans.map(plan => (
                        <PlanCard 
                            id={plan._id}
                            description={plan.description}
                            timeUntil={plan.timeUntil}
                            startTime = {plan.startTime}
                            key={plan._id}
                            location={plan.location}
                        />
                    ))}
                </CardContainer>
            </div>
            : <div>
                <p>Please log in</p>
            </div>;


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
                {plansLoaded}
                <Footer />
            </div>
        );
    }
}

export default App;
