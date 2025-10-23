import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = ({ children }) => {
  const isLoggedin = useSelector((state) => state.user.isLoggedin);

  return isLoggedin===false ? children : <Navigate to="/" replace />;
};

export default GuestRoute;
