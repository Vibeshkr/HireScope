import axios from "axios";

const api = axios.create({
baseURL: "https://hire-server-5cs1.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(
      `${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.response?.data ||
        error.message
    );

    return Promise.reject(error);
  }
);

export default api;