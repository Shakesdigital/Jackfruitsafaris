import type { Metadata } from "next";
import Link from "next/link";
import { getAdminGalleryMedia, getAdminSafariPackagesForGallery } from "@/lib/cms-data";
import { DeleteButton } from "@/app/admin/_components/delete-button";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Photo Gallery",
};

type GalleryImage = {
  id: string;
  media_url: string;
  media_type: string;
  alt_text: string;
  caption?: string | null;
  photographer?: string | null;
  safari_package_id: string | null;
  order_column: number;
  status: string;
  permission_status: string;
  created_at: string;
};

type SafariOption = {
  id: string;
  slug: string;
  title: string;
};

export default async function GalleryAdminPage() {
  const images = await getAdminGalleryMedia();
  const safaris = await getAdminSafariPackagesForGallery();

  // Build a lookup of safari titles
  const safariMap = new Map<string, string>();
  safaris.forEach((s: SafariOption) => {
    safariMap.set(s.id, s.title);
  });

  // Group images by safari package, with unassociated images first
  const grouped = new Map<string, GalleryImage[]>();
  const unassociated: GalleryImage[] = [];

  (images || []).forEach((img: GalleryImage) => {
    if (img.safari_package_id && safariMap.has(img.safari_package_id)) {
      const key = img.safari_package_id;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(img);
    } else {
      unassociated.push(img);
    }
  });

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Photo Gallery</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage gallery images linked to safari packages.
          </p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Add Image
        </Link>
      </div>

      {images.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">No gallery images yet. Add your first image to get started.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Unassociated images */}
          {unassociated.length > 0 && (
            <GalleryGroup
              title="Unassociated"
              images={unassociated}
            />
          )}

          {/* Safari-grouped images */}
          {Array.from(grouped.entries()).map(([safariId, safariImages]) => (
            <GalleryGroup
              key={safariId}
              title={safariMap.get(safariId) || "Unknown safari"}
              images={safariImages}
              safariId={safariId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type GalleryGroupProps = {
  title: string;
  images: GalleryImage[];
  safariId?: string;
};

function GalleryGroup({ title, images, safariId }: GalleryGroupProps) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-800">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Alt text
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Caption
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Order
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {images.map((img) => (
              <tr key={img.id}>
                <td className="px-3 py-3">
                  <img
                    src={img.media_url}
                    alt={img.alt_text}
                    className="h-16 w-16 rounded object-cover"
                  />
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">{img.alt_text}</td>
                <td className="px-3 py-3 text-sm text-gray-600">{img.caption || "—"}</td>
                <td className="px-3 py-3 text-sm text-gray-500">{img.order_column}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      img.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {img.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/gallery/${img.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <form
                      action="/admin/gallery/actions"
                      method="post"
                    >
                      <DeleteButton
                        form="delete-form"
                        formAction="/admin/gallery/actions"
                        value={img.id}
                        confirmMessage="Delete this gallery image?"
                      />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Quick link to add an image for this specific safari */}
      {safariId && (
        <Link
          href={`/admin/gallery/new?safari=${safariId}`}
          className="mt-2 inline-block text-sm text-blue-600 hover:underline"
        >
          + Add image to {title}
        </Link>
      )}
    </div>
  );
}
