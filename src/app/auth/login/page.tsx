import Link from "next/link";
import { login } from "@/lib/server/actions";

export const metadata = {
  title: "Admin Login",
  description: "Jackfruit Safaris Admin Panel",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Jackfruit Safaris Admin
          </h1>
          <p className="mt-2 text-center text-gray-600">Sign in to access the CMS</p>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {decodeURIComponent(error)}
          </div>
        )}
        <form action="/api/admin/login" method="POST" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              placeholder="admin@jackfruitsafaris.org"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
          >
            Sign in
          </button>
        </form>
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
