import axios from "axios";

const API = {
  login: function(newUser) {
    return axios.post("/login", newUser);
  }
};

export default API;