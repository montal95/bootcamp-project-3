import axios from "axios";

const API = {
  login: function(newUser) {
    console.log("login post route");
    console.log("testing newUser data received from front end");
    console.log(newUser);
    console.log("===============================");

    return axios.post("/login", newUser);
  },
  getInfo: function(id) {
    console.log("get user info route");
    console.log("Getting info for logged in user: ");
    console.log(id);
    console.log("=========================");
    return axios.get(`/api/plans/${id}`);
  },
  newUser: function(newUser) {
    console.log("newUser post route");
    console.log("testing newUser data received from front end");
    console.log(newUser);
    console.log("===============================");
    
    return axios.post("/api/user", newUser);
  },
  newPlan: function(id) {
    return axios.post(`/api/user/${id}`);
  },
  getCalendarInfo: function() {
    return axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList`);
  },
  verifyGoogleToken: function(userGoogleToken) {
    console.log("post route for verifyGooglenToken");
    console.log("testing userGoogleToken");
    console.log(userGoogleToken);
    
    return axios.get(`/api/tokensignin/`, userGoogleToken);
  },
  getGoogleClientID: function () {
    console.log("route to retrieve googleclientid from backend's .env");
    return axios.get(`/api/googleclientid/`);
  },
  deleteUser: function(id) {
    return axios.delete(`/api/user/${id}`);
  },
  deletePlan: function(id) {
    return axios.delete(`/api/user/${id}`);
  }
};

export default API;
