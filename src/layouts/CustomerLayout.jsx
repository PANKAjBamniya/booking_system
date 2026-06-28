import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../redux/slices/notificationsSlice";
import { MobileFrame } from "../components/mobile/MobileFrame";
import { BottomNav } from "../components/mobile/BottomNav";

const CustomerLayout = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());

      const interval = setInterval(() => {
        dispatch(fetchNotifications());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [dispatch, isAuthenticated]);

  return (
    <MobileFrame>
      <div className="pb-24">
        <Outlet />
      </div>
      <BottomNav />
    </MobileFrame>
  );
};

export default CustomerLayout;
