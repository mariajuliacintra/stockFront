import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.12.225:5000/reservas/v1/",
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
  postLogin: (usuario) => api.post(`/user/login`, usuario),
  postCadastro: (usuario) => api.post(`/user/register`, usuario),
};

export default sheets;
