import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { RiAdminLine } from "react-icons/ri";
import Field from "../../Styles/Input";
import AppButton from "../../Styles/Button";
import adminAxios, {
  setAdminSession,
  clearAdminSession,
} from "../../config/adminAxios";

const AdminLogin = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in email and password");
      return;
    }
    setLoading(true);
    try {
      // plain login call — the admin session never touches ETalkUser
      const login = await adminAxios.post("/api/user/login", {
        email,
        password,
      });
      setAdminSession(login.data.token);
      const me = await adminAxios.get("/api/user/getmyself");
      const details = me.data?.user?.userDetails;
      if (details?.role !== "admin") {
        clearAdminSession();
        toast.error("This account does not have admin access");
      } else {
        onSuccess(details);
      }
    } catch (error) {
      clearAdminSession();
      toast.error(error?.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <Wrapper className="flex items-center justify-center min-h-screen p-4">
      <form className="card w-full max-w-sm p-8" onSubmit={handleLogin}>
        <div className="flex items-center gap-3 mb-6">
          <span className="icon-badge flex items-center justify-center">
            <RiAdminLine />
          </span>
          <div>
            <h1 className="text-xl font-semibold m-0">V-Talk Admin</h1>
            <p className="subtitle text-sm m-0">
              Sign in with admin credentials
            </p>
          </div>
        </div>
        <Field
          label="Email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          password
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AppButton $variant="primary" $block type="submit" loading={loading}>
          Sign in
        </AppButton>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .card {
    background-color: ${({ theme }) => theme.colors.bg.primary};
    border-radius: ${({ theme }) => theme.radius.xl};
    box-shadow: ${({ theme }) => theme.colors.shadow.md};
  }
  .icon-badge {
    width: 42px;
    height: 42px;
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.accent.soft};
    color: ${({ theme }) => theme.colors.accent.solid};
    font-size: 1.4rem;
  }
  h1 {
    color: ${({ theme }) => theme.colors.heading};
  }
  .subtitle {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

export default AdminLogin;
