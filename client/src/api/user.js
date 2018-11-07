import axios from "axios";

const API = {
  login: function(newUser) {
    return axios.post("/login", newUser);
  },
  getInfo: function(id) {
    return axios.get(`/api/plans/${id}`);
  },
  newUser: function(newUser) {
    return axios.post("/api/user");
  },
  newPlan: function(id) {
    return axios.post(`/api/user/${id}`);
  }
};

export default API;
