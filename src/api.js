import axios from "axios";

// Replace this with your actual backend URL
const API_BASE_URL = "http://192.168.45.10:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
