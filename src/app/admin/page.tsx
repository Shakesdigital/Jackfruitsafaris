import Link from "next/link";

export const metadata = {
  title: "Dashboard",
};

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/pages"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage website pages and content sections
          </p>
        </Link>

        <Link
          href="/admin/destinations"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900">Destinations</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage safari destinations and regions
          </p>
        </Link>

        <Link
          href="/admin/safaris"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900">Safari Packages</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create and edit safari itineraries
          </p>
        </Link>

        <Link
          href="/admin/experiences"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900">Experiences</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage activity experiences
          </p>
        </Link>

        <Link
          href="/admin/reviews"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage guest testimonials and reviews
          </p>
        </Link>

        <Link
          href="/admin/leads"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900">Inquiry Leads</h2>
          <p className="mt-2 text-sm text-gray-600">
            View and manage customer inquiries
          </p>
        </Link>
      </div>
    </div>
  );
}