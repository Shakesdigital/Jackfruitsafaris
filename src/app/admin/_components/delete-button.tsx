"use client";

import type { ReactNode } from "react";

type DeleteButtonProps = {
  form: string;
  formAction: string;
  value: string;
  confirmMessage: string;
  children?: ReactNode;
};

export function DeleteButton({
  form,
  formAction,
  value,
  confirmMessage,
  children = "Delete",
}: DeleteButtonProps) {
  return (
    <button
      type="submit"
      form={form}
      formAction={formAction}
      formMethod="post"
      name="delete"
      value={value}
      className="rounded-md bg-red-600 px-4 py-3 text-sm text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
