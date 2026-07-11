import React, { Fragment } from "react";
import styled from "styled-components";
import { Dialog, Transition } from "@headlessui/react";
import AppButton from "../../Styles/Button";

// Small reusable confirmation dialog for destructive admin actions.
const ConfirmDialog = ({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  loading = false,
  onConfirm,
  onCancel,
}) => (
  <Transition appear show={open} as={Fragment}>
    <Dialog
      as="div"
      className="relative z-20"
      onClose={loading ? () => {} : onCancel}
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
              className="w-full max-w-sm transform overflow-hidden p-6 text-left align-middle transition-all"
            >
              <Dialog.Title as="h3" className="title text-lg font-medium m-0">
                {title}
              </Dialog.Title>
              <p className="body text-sm mt-2 mb-5">{body}</p>
              <div className="flex justify-end gap-2">
                <AppButton
                  $variant="secondary"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </AppButton>
                <AppButton
                  $variant="danger"
                  onClick={onConfirm}
                  loading={loading}
                >
                  {confirmLabel}
                </AppButton>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

const Panel = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.lg};
  .title {
    color: ${({ theme }) => theme.colors.heading};
  }
  .body {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export default ConfirmDialog;
