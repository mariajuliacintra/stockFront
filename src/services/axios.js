import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.72:5001/stock/",
  headers: { accept: "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("tokenUsuario");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const sheets = {
  postLogin: (user) => api.post(`user/login/`, user),
  postRegister: (user) => api.post(`user/register/`, user),
};

export default sheets;
