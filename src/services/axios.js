import axios from "axios";

const BASE_URL = "http://10.89.240.82:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
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
      const isAuthError = status === 401 || status === 403;
      const isLoginOrVerify =
        config.url.includes("user/login") ||
        config.url.includes("verify-register");

      if (isAuthError && !isLoginOrVerify) {
        localStorage.setItem("refresh_token", true);
        localStorage.removeItem("tokenUsuario");
        localStorage.removeItem("authenticated");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

const sheets = {
  downloadApk: () => {
    return api.get("/download/apk/app.apk", {
      responseType: "blob",
    });
  },

  importItemsExcel: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("import/excel/items", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getReportUrl: (type, format) => {
    let endpoint = "";
    switch (type) {
      case "general":
        endpoint = `report/${format}/general`;
        break;
      case "low-stock":
        endpoint = `report/${format}/low-stock`;
        break;
      case "transactions":
        endpoint = `report/${format}/transactions`;
        break;
      default:
        return null;
    }
    return endpoint;
  },

  downloadReport: (reportType, format) => {
    const endpoint = sheets.getReportUrl(reportType, format);

    return api.get(endpoint, {
      responseType: "blob",
    });
  },
  postLogin: (user) => api.post(`user/login`, user),
  postRegister: (user) => api.post(`user/register`, user),
  securyCodeApi: (code, email) =>
    api.post(`user/verify-register`, { code, email }),
  postVerifyRecoveryPassword: (email) =>
    api.post("user/verify-recovery-password", email),
  postValidateRecoveryCode: (data) =>
    api.post("user/validate-recovery-code", data),
  postRecoveryPassword: (data) => api.post("user/recovery-password", data),
  getItens: (config) => api.get(`items/`,config),
  getItensID: (id_item) => api.get(`item/${id_item}/details`, id_item),
  getLocations: () => api.get("location"),
  getTransactionsByUser: (userId) => api.get(`transactions/user/${userId}`),
  getUserProfile: (id) => api.get(`user/${id}`),
  putUpdateProfile: (id, data) => api.put(`user/${id}`, data),
  postVerifyUpdate: (data) => api.post(`user/verify-update`, data),
  deleteProfile: (id) => api.delete(`user/${id}`),
  CreateLot: (lot, idLot) => api.put(`lot/quantity/${idLot}`, lot),
  putUpdatePassword: (id, data) => api.put(`user/${id}`, data),
  getUsers: (config) => api.get("users", config),
  filterItens: (data) => api.post(`items/filter`, data),
  updateUser: (id, data) => api.put(`user/${id}`, data),
  createUser: (userData) => api.post("user/create", userData),
  registerUserByManager: (user) => api.post(`user/register/manager`, user),
  deleteUser: (id) => api.delete(`user/${id}`),
  postImage: (id_item, formData) => {
    return api.post(`item/image/${id_item}`, formData, {});
  },
  createCategory: (data) => api.post("category", data),
  createLocation: (data) => api.post("location", data),
  getCategories: () => api.get("category"),
  getTechnicalSpecs: () => api.get(`technicalSpec/`),
  createTechnicalSpec: (technicalSpecKey) =>
    api.post(`technicalSpec/`, technicalSpecKey),
  postAddItem: (itemData) => api.post(`/item`, itemData),
  deleteItem: (idItem) => api.delete(`item/${idItem}`),
};

export default sheets;
