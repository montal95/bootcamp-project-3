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
  deleteUser: function(id) {
    return axios.delete(`/api/user/${id}`);
  },
  deletePlan: function(id) {
    return axios.delete(`/api/user/${id}`);
  }
};

export default API;
