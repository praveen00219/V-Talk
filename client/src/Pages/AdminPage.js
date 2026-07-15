import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Loading from "../Components/Loading";
import adminAxios, {
  getAdminToken,
  clearAdminSession,
} from "../config/adminAxios";
import AdminLogin from "../Components/Admin/AdminLogin";
import AdminDashboard from "../Components/Admin/AdminDashboard";

const AdminPage = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const darkThemeEnabled = useSelector(
    (state) => state.themeReducer.darkThemeEnabled
  );

  // validate any stored admin token on mount
  useEffect(() => {
    const validateSession = async () => {
      if (!getAdminToken()) {
        setChecking(false);
        return;
      }
      try {
        const res = await adminAxios.get("/api/user/getmyself");
        const details = res.data?.user?.userDetails;
        if (details?.role === "admin") {
          setAdminUser(details);
        } else {
          clearAdminSession();
        }
      } catch (error) {
        // a 401 already cleared the session in the interceptor
      }
      setChecking(false);
    };
    validateSession();
  }, []);

  const handleLogout = () => {
    clearAdminSession(); // never touches the chat session (ETalkUser)
    setAdminUser(null);
  };

  return (
    <Wrapper>
      <ToastContainer theme={darkThemeEnabled ? "dark" : "light"} />
      {checking ? (
        <Loading />
      ) : adminUser ? (
        <AdminDashboard adminUser={adminUser} onLogout={handleLogout} />
      ) : (
        <AdminLogin onSuccess={setAdminUser} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export default AdminPage;
