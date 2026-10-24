import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminTeamMemberByIdResult } from "@/lib/cms-data";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { AdminLoadError } from "@/app/admin/_components/admin-load-error";
import {
  ImageUploadField,
  KeyValueEditor,
  SocialLinkEditor,
} from "@/app/admin/_components/cms-form-controls";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Team Member",
};

export default async function TeamMemberEditPage({ params }: Props) {
  const { id } = await params;
  const memberResult = await getAdminTeamMemberByIdResult(id);
  const member = memberResult.data;

  if (memberResult.error) {
    return (
      <AdminLoadError
        title="Team member could not be loaded"
        message={memberResult.error}
        code={memberResult.code}
        backHref="/admin/team"
        backLabel="Back to team members"
      />
    );
  }

  if (!member && id !== "new") {
    notFound();
  }

  const isNew = id === "new";

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Team Member" : "Edit Team Member"}
        </h1>
        {!isNew && (
          <DeleteButton
            form="team-member-form"
            formAction={`/admin/team/actions`}
            value={member?.id ?? ""}
            confirmMessage="Delete this team member?"
          >
            Delete
          </DeleteButton>
        )}
      </div>

      <form
        id="team-member-form"
        action="/admin/team/actions"
        method="post"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        encType="multipart/form-data"
      >
        <input type="hidden" name="id" value={member?.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Slug</span>
            <input
              required
              name="slug"
              defaultValue={member?.slug}
              placeholder="elvis-tumwebaze"
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={member?.status || "draft"}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              required
              name="name"
              defaultValue={member?.name}
              placeholder="Elvis Tumwebaze"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Position</span>
            <input
              name="position"
              defaultValue={member?.position}
              placeholder="Founder & Managing Director"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Display Order</span>
          <input
            type="number"
            name="display_order"
            defaultValue={member?.display_order ?? 0}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            defaultValue={member?.email ?? ""}
            placeholder="elvis@jackfruitsafaris.com"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Phone</span>
          <input
            name="phone"
            defaultValue={member?.phone ?? ""}
            placeholder="+256 772 550 268"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Bio</span>
          <textarea
            name="bio"
            defaultValue={member?.bio ?? ""}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <ImageUploadField
          name="photo_url"
          fileName="photo_file"
          label="Profile Photo"
          currentUrl={member?.photo_url}
        />

        <SocialLinkEditor
          name="social_links"
          label="Social Links"
          value={member?.social_links}
        />

        <SEOFields member={member} />

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/team"
            className="rounded-md border border-gray-300 min-h-[44px] px-4 py-3 text-sm hover:bg-gray-50 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 min-h-[44px] px-4 py-3 text-sm text-white hover:bg-blue-700 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            Save Team Member
          </button>
        </div>
      </form>
    </div>
  );
}

function SEOFields({
  member,
}: {
  member: Record<string, string | null | undefined> | null;
}) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">SEO</h3>
      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Title</span>
          <input
            name="meta_title"
            defaultValue={member?.meta_title ?? ""}
            placeholder="Team member SEO title"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Description</span>
          <textarea
            name="meta_description"
            defaultValue={member?.meta_description ?? ""}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
      </div>
    </div>
  );
}
