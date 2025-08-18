export const isAuthenticated = () => {
  const token = localStorage.getItem("authenticated");
  return !!token;
};

export function getIdFromToken() {
  const token = localStorage.getItem("tokenUsuario");
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.id;
  } catch (error) {
    console.error("Token inválido", error);
    return null;
  }
};