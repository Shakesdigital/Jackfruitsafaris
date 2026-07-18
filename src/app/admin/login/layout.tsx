// This layout only applies to /admin/login - no sidebar needed
// It overrides the parent admin layout for the login page specifically
import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}