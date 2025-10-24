import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const GuestRoute = ({ children }) => {
  const {isLoggedin, authLoading} = useSelector((state) => state.user);

  if (authLoading) return <Loader />;

  return isLoggedin===false ? children : <Navigate to="/" replace />;
};

export default GuestRoute;
