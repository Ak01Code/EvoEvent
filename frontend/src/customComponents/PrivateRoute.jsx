import { createContext } from "react";
import { Navigate } from "react-router-dom";

const CreatePrivateRoute = createContext();

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <CreatePrivateRoute.Provider value={{}}>
      {children}
    </CreatePrivateRoute.Provider>
  );
};

export default PrivateRoute;
