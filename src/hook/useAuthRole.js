import { useMemo } from "react";
import { useSelector } from "react-redux";

const useAuthRole = () => {
  const { user, token, loading } = useSelector((state) => state.auth);

  const role = user?.role || "customer";

  const isAuthenticated = !!token;
  const isAdmin = role === "admin";
  const isCustomer = role === "customer";

  return useMemo(
    () => ({
      user,
      token,
      loading,
      role,
      isAuthenticated,
      isAdmin,
      isCustomer,
    }),
    [user, token, loading, role]
  );
};

export default useAuthRole;