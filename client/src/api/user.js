import axios from "axios";

const API = {
  login: function(newUser) {
    console.log("login post route");
    console.log("testing newUser data received from front end");
    console.log(newUser);
    console.log("===============================");

    return axios.post("/login", newUser);
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
  }
};

export default API;
