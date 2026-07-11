import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { toast } from "react-toastify";
import {
  FiEdit2,
  FiSlash,
  FiCheckCircle,
  FiRotateCcw,
  FiTrash2,
} from "react-icons/fi";
import adminAxios from "../../config/adminAxios";
import AppButton from "../../Styles/Button";
import Field from "../../Styles/Input";
import { FREE_DEFAULTS, getTodayKey } from "../../config/planLimits";
import EditSubscriptionModal from "./EditSubscriptionModal";
import ConfirmDialog from "./ConfirmDialog";

const PAGE_SIZE = 20;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "free", label: "Free" },
  { key: "premium", label: "Premium" },
  { key: "blocked", label: "Blocked" },
];

// effective daily limits: per-user override wins, else plan default (null = unlimited)
const effectiveLimits = (user) => ({
  messages:
    user.messageLimit != null
      ? user.messageLimit
      : user.plan === "premium"
      ? null
      : FREE_DEFAULTS.messages,
  files:
    user.fileLimit != null
      ? user.fileLimit
      : user.plan === "premium"
      ? null
      : FREE_DEFAULTS.files,
});

const todayUsage = (user) =>
  user.usage && user.usage.day === getTodayKey()
    ? {
        messagesSent: user.usage.messagesSent || 0,
        filesShared: user.usage.filesShared || 0,
      }
    : { messagesSent: 0, filesShared: 0 };

// one thin quota bar; hidden when the limit is unlimited
const QuotaBar = ({ used, limit, word }) => {
  if (limit === null) {
    return (
      <div className="quota-row">
        <span className="quota-text">{used} {word}</span>
        <span className="quota-unlimited">∞</span>
      </div>
    );
  }
  const pct = limit === 0 ? 100 : Math.min(100, Math.round((used / limit) * 100));
  const tone = pct >= 100 ? "danger" : pct >= 70 ? "warning" : "ok";
  return (
    <div className="quota-row">
      <span className="quota-text">
        {used}/{limit} {word}
      </span>
      <span className="quota-track">
        <span className={`quota-fill ${tone}`} style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
};

const UsersTable = ({ adminUser, refreshSignal, onChanged }) => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [confirm, setConfirm] = useState(null); // { type: "delete"|"block", user }
  const [confirmBusy, setConfirmBusy] = useState(false);

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const params = { search, page, limit: PAGE_SIZE };
    if (filter === "free" || filter === "premium") params.plan = filter;
    if (filter === "blocked") params.status = "blocked";
    adminAxios
      .get("/api/admin/users", { params })
      .then((res) => {
        if (!alive) return;
        setUsers(res.data.users);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch((err) => {
        if (alive)
          toast.error(err?.response?.data?.message || "Failed to load users");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [search, page, filter, refreshSignal]);

  const changeFilter = (key) => {
    setFilter(key);
    setPage(1);
  };

  const replaceRow = (updated) =>
    setUsers((prev) =>
      prev.map((u) => (u._id === updated._id ? { ...u, ...updated } : u))
    );

  const setBlocked = async (user, isBlocked) => {
    try {
      const res = await adminAxios.put(`/api/admin/users/${user._id}/block`, {
        isBlocked,
      });
      replaceRow(res.data.user);
      toast.success(res.data.message);
      onChanged();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
  };

  const resetUsage = async (user) => {
    try {
      const res = await adminAxios.put(
        `/api/admin/users/${user._id}/reset-usage`
      );
      replaceRow(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
  };

  const handleConfirm = async () => {
    if (!confirm) return;
    setConfirmBusy(true);
    if (confirm.type === "block") {
      await setBlocked(confirm.user, true);
    } else if (confirm.type === "delete") {
      try {
        const res = await adminAxios.delete(
          `/api/admin/users/${confirm.user._id}`
        );
        toast.success(res.data.message);
        onChanged(); // refetches table + stats
      } catch (error) {
        toast.error(error?.response?.data?.message || "Delete failed");
      }
    }
    setConfirmBusy(false);
    setConfirm(null);
  };

  return (
    <Wrapper>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-lg font-semibold m-0">Users</h2>
          <div className="filters flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`chip ${filter === f.key ? "active" : ""}`}
                onClick={() => changeFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="search-box w-full max-w-xs">
          <Field
            placeholder="Search name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <div className="table-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Usage today</th>
              <th>Status</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="empty">
                  Loading users…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelf = String(user._id) === String(adminUser._id);
                const limits = effectiveLimits(user);
                const used = todayUsage(user);
                return (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="avatar-wrap">
                          <img
                            src={user.pic}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          {user.online ? (
                            <span className="online-dot" title="Online now" />
                          ) : null}
                        </span>
                        <span className="min-w-0">
                          <span className="name block truncate">
                            {user.name}
                            {user.role === "admin" ? (
                              <span className="admin-tag"> admin</span>
                            ) : null}
                          </span>
                          <span className="email block truncate">
                            {user.email}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.plan === "premium" ? "premium" : "free"
                        }`}
                      >
                        {user.plan === "premium" ? "Premium" : "Free"}
                      </span>
                    </td>
                    <td className="quota-cell">
                      <QuotaBar
                        used={used.messagesSent}
                        limit={limits.messages}
                        word="msgs"
                      />
                      <QuotaBar
                        used={used.filesShared}
                        limit={limits.files}
                        word="files"
                      />
                    </td>
                    <td>
                      {user.isBlocked ? (
                        <span className="pill blocked">Blocked</span>
                      ) : (
                        <span className="pill active">Active</span>
                      )}
                    </td>
                    <td className="muted">
                      {moment(user.createdAt).format("DD MMM YYYY")}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          className="action"
                          title="Edit subscription"
                          onClick={() => setEditTarget(user)}
                        >
                          <FiEdit2 />
                        </button>
                        {user.isBlocked ? (
                          <button
                            className="action"
                            title="Unblock user"
                            disabled={isSelf}
                            onClick={() => setBlocked(user, false)}
                          >
                            <FiCheckCircle />
                          </button>
                        ) : (
                          <button
                            className="action"
                            title="Block user"
                            disabled={isSelf}
                            onClick={() => setConfirm({ type: "block", user })}
                          >
                            <FiSlash />
                          </button>
                        )}
                        <button
                          className="action"
                          title="Reset today's usage"
                          onClick={() => resetUsage(user)}
                        >
                          <FiRotateCcw />
                        </button>
                        <button
                          className="action danger"
                          title="Delete user"
                          disabled={isSelf || user.role === "admin"}
                          onClick={() => setConfirm({ type: "delete", user })}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
        <span className="muted text-xs">
          Page {page} of {pages} · {total} users
        </span>
        <div className="flex gap-2">
          <AppButton
            $variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </AppButton>
          <AppButton
            $variant="secondary"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </AppButton>
        </div>
      </div>

      <EditSubscriptionModal
        user={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={replaceRow}
      />
      <ConfirmDialog
        open={!!confirm}
        loading={confirmBusy}
        title={confirm?.type === "delete" ? "Delete user" : "Block user"}
        body={
          confirm
            ? confirm.type === "delete"
              ? `Permanently delete ${confirm.user.name} (${confirm.user.email})? Their messages and chats will remain.`
              : `Block ${confirm.user.name} (${confirm.user.email})? They won't be able to log in or send messages until unblocked.`
            : ""
        }
        confirmLabel={confirm?.type === "delete" ? "Delete" : "Block"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  h2 {
    color: ${({ theme }) => theme.colors.heading};
  }
  .muted {
    color: ${({ theme }) => theme.colors.text.muted};
  }
  .chip {
    padding: 0.3rem 0.85rem;
    border: 1px solid rgba(${({ theme }) => theme.colors.border}, 0.8);
    border-radius: ${({ theme }) => theme.radius.pill};
    background: transparent;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    &:hover {
      border-color: ${({ theme }) => theme.colors.accent.solid};
      color: ${({ theme }) => theme.colors.accent.solid};
    }
    &.active {
      background: ${({ theme }) => theme.colors.accent.solid};
      border-color: ${({ theme }) => theme.colors.accent.solid};
      color: #fff;
    }
  }
  .table-card {
    background-color: ${({ theme }) => theme.colors.bg.elevated};
    border-radius: ${({ theme }) => theme.radius.lg};
    box-shadow: ${({ theme }) => theme.colors.shadow.sm};
    border: 1px solid rgba(${({ theme }) => theme.colors.border}, 0.4);
  }
  table {
    border-collapse: collapse;
    min-width: 760px;
  }
  thead th {
    position: sticky;
    top: 0;
    background-color: ${({ theme }) => theme.colors.bg.elevated};
    color: ${({ theme }) => theme.colors.text.muted};
    text-align: left;
    font-weight: 600;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 0.8rem 1rem;
    border-bottom: 1px solid rgba(${({ theme }) => theme.colors.border}, 1);
  }
  tbody td {
    padding: 0.7rem 1rem;
    border-bottom: 1px solid rgba(${({ theme }) => theme.colors.border}, 0.5);
    color: ${({ theme }) => theme.colors.text.primary};
    white-space: nowrap;
    vertical-align: middle;
  }
  tbody tr {
    transition: background 0.12s ease;
    &:hover {
      background: rgba(${({ theme }) => theme.colors.border}, 0.18);
    }
    &:last-child td {
      border-bottom: none;
    }
  }
  .empty {
    text-align: center;
    color: ${({ theme }) => theme.colors.text.muted};
    padding: 2rem 1rem;
  }
  .avatar-wrap {
    position: relative;
    flex-shrink: 0;
    .online-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.success};
      border: 2px solid ${({ theme }) => theme.colors.bg.elevated};
    }
  }
  .name {
    color: ${({ theme }) => theme.colors.heading};
    font-weight: 500;
    max-width: 180px;
  }
  .email {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.78rem;
    max-width: 180px;
  }
  .admin-tag {
    color: ${({ theme }) => theme.colors.accent.solid};
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
  }
  .badge {
    display: inline-block;
    padding: 0.15rem 0.6rem;
    border-radius: ${({ theme }) => theme.radius.pill};
    font-size: 0.75rem;
    font-weight: 600;
    &.premium {
      background: ${({ theme }) => theme.colors.accent.soft};
      color: ${({ theme }) => theme.colors.accent.solid};
    }
    &.free {
      background: rgba(${({ theme }) => theme.colors.border}, 0.5);
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }
  .pill {
    display: inline-block;
    padding: 0.15rem 0.6rem;
    border-radius: ${({ theme }) => theme.radius.pill};
    font-size: 0.75rem;
    font-weight: 600;
    &.active {
      background: rgba(${({ theme }) => theme.colors.successRgb}, 0.12);
      color: ${({ theme }) => theme.colors.success};
    }
    &.blocked {
      background: rgba(${({ theme }) => theme.colors.dangerRgb}, 0.12);
      color: ${({ theme }) => theme.colors.danger};
    }
  }
  .quota-cell {
    min-width: 170px;
  }
  .quota-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    & + .quota-row {
      margin-top: 4px;
    }
  }
  .quota-text {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    min-width: 74px;
  }
  .quota-unlimited {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.85rem;
  }
  .quota-track {
    display: inline-block;
    width: 70px;
    height: 5px;
    border-radius: 3px;
    background: rgba(${({ theme }) => theme.colors.border}, 0.6);
    overflow: hidden;
  }
  .quota-fill {
    display: block;
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;
    &.ok {
      background: ${({ theme }) => theme.colors.success};
    }
    &.warning {
      background: ${({ theme }) => theme.colors.warning};
    }
    &.danger {
      background: ${({ theme }) => theme.colors.danger};
    }
  }
  .action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: ${({ theme }) => theme.radius.sm};
    background: transparent;
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: pointer;
    font-size: 0.95rem;
    transition: background 0.15s ease, color 0.15s ease;
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accent.soft};
      color: ${({ theme }) => theme.colors.accent.solid};
    }
    &.danger:hover:not(:disabled) {
      background: rgba(${({ theme }) => theme.colors.dangerRgb}, 0.12);
      color: ${({ theme }) => theme.colors.danger};
    }
    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }
  .search-box > div {
    margin-bottom: 0;
  }
`;

export default UsersTable;
