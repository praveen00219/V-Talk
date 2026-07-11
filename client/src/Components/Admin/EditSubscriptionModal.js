import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import adminAxios from "../../config/adminAxios";
import Field from "../../Styles/Input";
import AppButton from "../../Styles/Button";
import { FREE_DEFAULTS } from "../../config/planLimits";

// Edit a user's plan and per-user daily limits. `user` = null means closed.
const EditSubscriptionModal = ({ user, onClose, onSaved }) => {
  const [plan, setPlan] = useState("free");
  const [messageLimit, setMessageLimit] = useState("");
  const [fileLimit, setFileLimit] = useState("");
  const [saving, setSaving] = useState(false);

  // sync form state whenever a new user is opened
  useEffect(() => {
    if (user) {
      setPlan(user.plan || "free");
      setMessageLimit(user.messageLimit != null ? String(user.messageLimit) : "");
      setFileLimit(user.fileLimit != null ? String(user.fileLimit) : "");
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminAxios.put(
        `/api/admin/users/${user._id}/subscription`,
        {
          plan,
          messageLimit: messageLimit === "" ? null : Number(messageLimit),
          fileLimit: fileLimit === "" ? null : Number(fileLimit),
        }
      );
      toast.success(res.data.message || "Subscription updated");
      onSaved(res.data.user);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
    setSaving(false);
  };

  return (
    <Transition appear show={!!user} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={saving ? () => {} : onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                as={Panel}
                className="w-full max-w-md transform overflow-hidden p-6 text-left align-middle transition-all"
              >
                <Dialog.Title as="h3" className="title text-lg font-medium m-0">
                  Edit subscription
                </Dialog.Title>
                <p className="subtitle text-sm mt-1 mb-5">
                  {user?.name} · {user?.email}
                </p>

                <label className="field-label block text-sm font-semibold mb-1">
                  Plan
                </label>
                <select
                  className="plan-select w-full mb-4"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                >
                  <option value="free">Free (daily limits apply)</option>
                  <option value="premium">Premium (unlimited)</option>
                </select>

                <Field
                  label="Daily message limit"
                  type="number"
                  min="0"
                  step="1"
                  placeholder={`Default (${plan === "premium" ? "unlimited" : FREE_DEFAULTS.messages})`}
                  value={messageLimit}
                  onChange={(e) => setMessageLimit(e.target.value)}
                />
                <Field
                  label="Daily file limit"
                  type="number"
                  min="0"
                  step="1"
                  placeholder={`Default (${plan === "premium" ? "unlimited" : FREE_DEFAULTS.files})`}
                  value={fileLimit}
                  onChange={(e) => setFileLimit(e.target.value)}
                />
                <p className="hint text-xs mb-4">
                  Leave a limit blank to use the plan default. 0 means the user
                  cannot send at all.
                </p>

                <div className="flex justify-end gap-2">
                  <AppButton
                    $variant="secondary"
                    onClick={onClose}
                    disabled={saving}
                  >
                    Cancel
                  </AppButton>
                  <AppButton
                    $variant="primary"
                    onClick={handleSave}
                    loading={saving}
                  >
                    Save
                  </AppButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const Panel = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.lg};
  .title {
    color: ${({ theme }) => theme.colors.heading};
  }
  .subtitle,
  .hint {
    color: ${({ theme }) => theme.colors.text.muted};
  }
  .field-label {
    color: ${({ theme }) => theme.colors.heading};
  }
  .plan-select {
    background-color: ${({ theme }) => theme.colors.bg.secondary};
    color: ${({ theme }) => theme.colors.heading};
    border: 1px solid rgba(${({ theme }) => theme.colors.border}, 1);
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.7rem 0.9rem;
    font-size: 0.95rem;
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.accent.solid};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent.ring};
    }
  }
`;

export default EditSubscriptionModal;
