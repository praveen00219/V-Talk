import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";
import AppButton from "../../Styles/Button";
import StatsCards from "./StatsCards";
import UsersTable from "./UsersTable";

const AdminDashboard = ({ adminUser, onLogout }) => {
  // bumping this refetches stats + the user table (Refresh button, deletions)
  const [refreshSignal, setRefreshSignal] = useState(0);
  const refresh = () => setRefreshSignal((n) => n + 1);

  return (
    <Wrapper className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="brand-badge flex items-center justify-center">
            <RiAdminLine />
          </span>
          <div>
            <h1 className="text-2xl font-semibold m-0">Admin Portal</h1>
            <p className="subtitle text-sm m-0">
              Signed in as {adminUser.email} ·{" "}
              <Link to="/" className="back-link">
                Back to chat
              </Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <AppButton $variant="secondary" onClick={refresh}>
            Refresh
          </AppButton>
          <AppButton $variant="ghost" onClick={onLogout}>
            Logout
          </AppButton>
        </div>
      </header>

      <StatsCards refreshSignal={refreshSignal} />
      <UsersTable
        adminUser={adminUser}
        refreshSignal={refreshSignal}
        onChanged={refresh}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  h1 {
    color: ${({ theme }) => theme.colors.heading};
  }
  .brand-badge {
    width: 46px;
    height: 46px;
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.accent.gradient};
    color: #fff;
    font-size: 1.5rem;
    box-shadow: ${({ theme }) => theme.colors.shadow.sm};
  }
  .subtitle {
    color: ${({ theme }) => theme.colors.text.muted};
  }
  .back-link {
    color: ${({ theme }) => theme.colors.accent.solid};
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default AdminDashboard;
