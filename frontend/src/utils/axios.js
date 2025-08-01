import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://insta-clone-1-qxmq.onrender.com",
  withCredentials: true,
});

export default axiosInstance;
