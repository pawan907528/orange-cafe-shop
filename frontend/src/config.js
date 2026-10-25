import axios from "axios";
 
export const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";
 
// Har request ke saath login token automatically bhejo
axios.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
 
    if (user && user.token && config.url && config.url.startsWith(API_URL)) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (error) {
    // ignore bad localStorage data
  }
 
  return config;
});