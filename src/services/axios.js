import axios from "axios";

// A URL base da API é definida aqui.
const API_BASE_URL = "http://10.89.240.96:5000/stock/";

const api = axios.create({
  baseURL: API_BASE_URL,
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
  // --- Funções de Relatórios ---
importItemsExcel: (file) => {
  const formData = new FormData();
  formData.append("file", file); // 'file' deve corresponder ao nome do campo no multer (uploadExcel.single("file"))

  return api.post("import/excel/items", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
},
  getReportUrl: (type, format) => {
    let endpoint = '';
    switch (type) {
      case 'general':
        endpoint = `report/${format}/general`;
        break;
      case 'low-stock':
        endpoint = `report/${format}/low-stock`;
        break;
      case 'transactions':
        endpoint = `report/${format}/transactions`;
        break;
      default:
        return null;
    }
    // Retorna a URL completa para ser usada como endpoint no Axios
    return API_BASE_URL + endpoint; 
  },

  downloadReport: (reportType, format) => {
    const fullUrl = sheets.getReportUrl(reportType, format);
    const endpoint = fullUrl.replace(API_BASE_URL, '');

    return api.get(endpoint, {
      responseType: 'blob',
    });
  },

  // --- Funções Existentes ---
  postLogin: (user) => api.post(`user/login`, user),
  postRegister: (user) => api.post(`user/register`, user),
  securyCodeApi: (code, email) => api.post(`user/verify-register`, { code, email }),
  postVerifyRecoveryPassword: (email) => api.post("user/verify-recovery-password", email),
  postValidateRecoveryCode: (data) => api.post("user/validate-recovery-code", data),
  postRecoveryPassword: (data) => api.post("user/recovery-password", data),
  getItens: () => api.get(`items/`),
  getItensID: (id_item) => api.get(`item/${id_item}/details`, id_item),
  getLocations: () => api.get("locations"),
  postAddItem: (category, itemData) => api.post(`${category}`, itemData),
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
};

export default sheets;
