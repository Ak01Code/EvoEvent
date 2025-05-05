import { Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Event from "../Pages/Event";
import Register from "../Pages/Register";
import PrivateRoute from "./PrivateRoute";

const AllRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Event />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/event"
        element={
          <PrivateRoute>
            <Event />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AllRoutes;
