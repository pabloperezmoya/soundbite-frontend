
import axios from "axios";
const url = "http://localhost:8000" // Backend URL

function userLogin(data) {
    return axios.post(`${url}/user/login`, data,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

function userRegister(data) {
    return axios.post(`${url}/user/register`, data,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

function verifyUser(user_id, token) {
  return axios.post(`${url}/user/verify`, {
    "token": token,
    "user_id": user_id
  }, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

export {userLogin, userRegister, verifyUser};
