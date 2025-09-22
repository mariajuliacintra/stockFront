import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.82:5000/stock/",
  headers: { accept: "application/json" },
});

// Interceptor para adicionar o token JWT automaticamente
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

// Interceptor para tratar erros de resposta (401/403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const isLoginRequest = error.config.url.includes("user/login");
      const isVerifyRequest = error.config.url.includes("verify-register");
      if (
        (error.response.status === 401 || error.response.status === 403) &&
        error.response.data.auth === false &&
        !isLoginRequest &&
        !isVerifyRequest
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
  postLogin: (user) => api.post(`user/login`, user),
  postRegister: (user) => api.post(`user/register`, user),
  securyCodeApi: (code, email) =>
    api.post(`user/verify-register`, { code, email }),
  postVerifyRecoveryPassword: (email) =>
    api.post("user/verify-recovery-password", email),
  postValidateRecoveryCode: (data) =>
    api.post("user/validate-recovery-code", data),
  postRecoveryPassword: (data) => api.post("user/recovery-password", data),
  getItens: () => api.get(`items/`),
  getItensID: (id_item) => api.get(`item/${id_item}/details`, id_item),
  getLocations: () => api.get("locations"),
  postAddItem: (category, itemData) => api.post(`${category}`, itemData),
  getCategories: () => api.get("category"),
  getTransactionsByUser: (userId) => api.get(`transactions/user/${userId}`),
  getUserProfile: (id) => api.get(`user/${id}`), // Adicionei este endpoint, que parece ser necessário
  putUpdateProfile: (id, data) => api.put(`user/${id}`, data),
  postVerifyUpdate: (data) => api.post(`user/verify-update`, data),
  deleteProfile: (id) => api.delete(`user/${id}`),

};

export default sheets;