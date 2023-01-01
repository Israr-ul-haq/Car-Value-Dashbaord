import axios from "axios"

const instance = axios.create({
  baseURL: "http://18.192.212.127:5000/",
  // baseURL: "https://carvalue.jinnbytedev.com/",
  // baseURL: "https://carvaluekw.com:5000",
})
export default instance
