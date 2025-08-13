import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.91:5000/stock/",
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
  securyCodeApi: (code, email) => api.post(`user/verify-register`, {code, email}),
  postVerifyRecoveryPassword: (email) => api.post("user/verify-recovery-password", email),
  postValidateRecoveryCode: (data) => api.post("user/validate-recovery-code", data),
  postRecoveryPassword: (data) => api.post("user/recovery-password", data),
};

export default sheets;
