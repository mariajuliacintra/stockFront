
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../auth/auth";

const ProtectedRouter = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default ProtectedRouter;
