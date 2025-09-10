import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.82:5000/stock/",
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
api.interceptors.response.use(
  
  (response) => response,
  (error) => {
    if (error.response) {
      const isLoginRequest = error.config.url.includes("user/login");
      // Se for um erro 401 ou 403 E NÃO for a requisição de login, redireciona.
      if (
        (error.response.status === 401 || error.response.status === 403) &&
        error.response.data.auth === false &&
        !isLoginRequest
      ) {
        localStorage.setItem("refresh_token", true);
        localStorage.removeItem("tokenUsuario");
        localStorage.removeItem("authenticated");
        window.location.href = "/";
      }
    }
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
  getItens: (category, params) => api.get(`item/${category}`, { params }),
  getLocations: () => api.get("locations"),
  postAddItem: (category, itemData) => api.post(`${category}`, itemData),
};

export default sheets;
