import axios from "axios";

let baseURL = "";

console.log(process.env);

if (process.env.REACT_APP_ENV === "development") {
  baseURL = "http://localhost:3005";
} else {
  baseURL = "https://usp-chat-api.herokuapp.com/";
}

export default axios.create({
  baseURL
});
