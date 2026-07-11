import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  FiUsers,
  FiStar,
  FiSlash,
  FiMessageSquare,
  FiWifi,
} from "react-icons/fi";
import adminAxios from "../../config/adminAxios";

const TILES = [
  { key: "totalUsers", label: "Total users", icon: <FiUsers />, tone: "accent" },
  { key: "premium", label: "Premium / Free", icon: <FiStar />, tone: "warning" },
  { key: "blockedUsers", label: "Blocked", icon: <FiSlash />, tone: "danger" },
  { key: "messagesToday", label: "Messages today", icon: <FiMessageSquare />, tone: "info" },
  { key: "onlineNow", label: "Online now", icon: <FiWifi />, tone: "success" },
];

const StatsCards = ({ refreshSignal }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setError(null);
    adminAxios
      .get("/api/admin/stats")
      .then((res) => {
        if (alive) setStats(res.data);
      })
      .catch((err) => {
        if (alive)
          setError(err?.response?.data?.message || "Failed to load stats");
      });
    return () => {
      alive = false;
    };
  }, [refreshSignal]);

  const valueFor = (key) => {
    if (!stats) return "—";
    if (key === "premium") return `${stats.premiumUsers} / ${stats.freeUsers}`;
    return stats[key];
  };

  return (
    <Wrapper className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {error ? (
        <p className="error col-span-full m-0">{error}</p>
      ) : (
        TILES.map((tile) => (
          <div className={`tile p-4 ${stats ? "" : "loading"}`} key={tile.key}>
            <div className={`icon-badge ${tile.tone}`}>{tile.icon}</div>
            <div className="min-w-0">
              <div className="value text-xl font-semibold truncate">
                {valueFor(tile.key)}
              </div>
              <div className="label text-xs truncate">{tile.label}</div>
            </div>
          </div>
        ))
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .tile {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    background-color: ${({ theme }) => theme.colors.bg.elevated};
    border-radius: ${({ theme }) => theme.radius.lg};
    box-shadow: ${({ theme }) => theme.colors.shadow.sm};
    border: 1px solid rgba(${({ theme }) => theme.colors.border}, 0.4);
    transition: transform 0.15s ${({ theme }) => theme.motion.easeOut},
      box-shadow 0.2s ${({ theme }) => theme.motion.ease};
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.colors.shadow.md};
    }
    &.loading {
      opacity: 0.6;
    }
  }
  .icon-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: 1.15rem;
    &.accent {
      background: ${({ theme }) => theme.colors.accent.soft};
      color: ${({ theme }) => theme.colors.accent.solid};
    }
    &.success {
      background: rgba(${({ theme }) => theme.colors.successRgb}, 0.12);
      color: ${({ theme }) => theme.colors.success};
    }
    &.warning {
      background: rgba(${({ theme }) => theme.colors.warningRgb}, 0.14);
      color: ${({ theme }) => theme.colors.warning};
    }
    &.danger {
      background: rgba(${({ theme }) => theme.colors.dangerRgb}, 0.12);
      color: ${({ theme }) => theme.colors.danger};
    }
    &.info {
      background: rgba(${({ theme }) => theme.colors.infoRgb}, 0.12);
      color: ${({ theme }) => theme.colors.info};
    }
  }
  .value {
    color: ${({ theme }) => theme.colors.heading};
  }
  .label {
    color: ${({ theme }) => theme.colors.text.muted};
  }
  .error {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export default StatsCards;
