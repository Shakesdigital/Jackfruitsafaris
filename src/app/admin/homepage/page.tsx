import Link from "next/link";

export const metadata = {
  title: "Homepage Content",
};

export default async function HomepageAdminPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Homepage Content</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/homepage/hero"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
          <p className="mt-2 text-sm text-gray-600">
            Edit hero headline, subheading, and CTA buttons
          </p>
        </Link>

        <Link
          href="/admin/homepage/trust-items"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900">Trust Items</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage trust badges and awards displayed below hero
          </p>
        </Link>

        <Link
          href="/admin/homepage/quick-links"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900">Quick Links</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage the quick navigation buttons below hero
          </p>
        </Link>

        <Link
          href="/admin/homepage/features"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900">Why Uganda Features</h2>
          <p className="mt-2 text-sm text-gray-600">
            Edit the feature list in the Why Uganda section
          </p>
        </Link>

        <Link
          href="/admin/homepage/guide-articles"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900">Travel Guide Articles</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage guide article links shown on homepage
          </p>
        </Link>
      </div>
    </div>
  );
}