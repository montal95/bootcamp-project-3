import axios from "axios";

const API = {
  login: function (newUser) {
    console.log("login post route");
    console.log("testing newUser data received from front end");
    console.log(newUser);
    console.log("===============================");

    return axios.post("/login", newUser);
  },
  getInfoLocal: function (username) {
    console.log("get user info w/ plans route");
    console.log("Getting info for logged in user: ");
    console.log(username);
    console.log("=========================");
    return axios.get(`/api/plans/${username}`);
  },
  getInfoGoogle: function (email) {
    console.log("get user info w plans route");
    console.log("Getting info for logged in user: ");
    console.log(email);
    console.log("=========================");
    return axios.get(`/api/plans/google/${email}`);
  },
  newUser: function (newUser) {
    console.log("newUser post route");
    console.log("testing newUser data received from front end");
    console.log(newUser);
    console.log("===============================");

    return axios.post("/api/user/new", newUser);
  },
  newPlan: function (id, newPlan) {
    return axios.post(`/api/plan/${id}`, newPlan);
  },
  getCalendarInfo: function (googleAccessToken) {
    console.log("getCalendarinfo backend route");
    console.log("testing googleAccess Token");
    console.log(googleAccessToken);
    return axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, { headers: { 'Authorization': 'Bearer ' + googleAccessToken } });
  },
  verifyGoogleToken: function (userGoogleToken) {
    console.log("\npost route for verifyGooglenToken");
    console.log("testing userGoogleToken");
    console.log(userGoogleToken);

    return axios.get(`/api/tokensignin/`, userGoogleToken);
  },
  getGoogleClientID: function () {
    console.log("route to retrieve googleclientid from backend's .env");
    return axios.get(`/api/googleclientid/`);
  },
  deleteUser: function (id) {
    return axios.delete(`/api/user/${id}`);
  },
  deletePlan: function (id) {
    return axios.delete(`/api/user/${id}`);
  }
};

export default API;
