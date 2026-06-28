import { useSelector } from "react-redux";

const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isCheckingAuth,
  } = useSelector((state) => state.auth);

  const role = user?.role || "customer";

  return {
    user,
    token,
    role,
    isAuthenticated,
    isCheckingAuth,
    isAdmin: role === "admin",
    isCustomer: role === "customer",
  };
};

export default useAuth;