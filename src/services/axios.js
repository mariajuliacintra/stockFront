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
      const { status, config } = error.response;
      
      const isAuthError = (status === 401 || status === 403);
      const isLoginOrVerify = config.url.includes("user/login") || config.url.includes("verify-register");

      if (isAuthError && !isLoginOrVerify) {
          
          localStorage.setItem("refresh_token", true);
          localStorage.removeItem("tokenUsuario");
          localStorage.removeItem("authenticated");
          
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
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
  getLocations: () => api.get("location"),
  postAddItem: (itemData) => api.post(`/item`, itemData),
  getCategories: () => api.get("category"),
  getTransactionsByUser: (userId) => api.get(`transactions/user/${userId}`),
  getUserProfile: (id) => api.get(`user/${id}`),
  putUpdateProfile: (id, data) => api.put(`user/${id}`, data),
  postVerifyUpdate: (data) => api.post(`user/verify-update`, data),
  deleteProfile: (id) => api.delete(`user/${id}`),
  CreateLot: (lot, idLot) => api.put(`lot/quantity/${idLot}`, lot), 
  putUpdatePassword: (id, data) => api.put(`user/${id}`, data),
  getUsers: () => api.get("users"), 
  updateUser: (id, data) => api.put(`user/${id}`, data),
  createUser: (userData) => api.post("user/create", userData),
  registerUserByManager: (user) => api.post(`user/register/manager`, user),
  deleteUser: (id) => api.delete(`user/${id}`),
  insertImage: (id_item, imagem) => {
  const data = new FormData();
  data.append("imagem", imagem); // "imagem" deve ser o nome que o backend espera

  return api.post(`item/image/${id_item}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });
},
};

export default sheets;
