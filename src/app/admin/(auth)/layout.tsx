// Auth route group layout - no authentication required
// This allows access to /admin/login without being logged in
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}