import React from "react";
import { Navigate } from "react-router-dom";
import Home from "./Home";
import useAuth from "../hook/useAuth";

const RoleBasedHome = () => {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Home />;
};

export default RoleBasedHome;