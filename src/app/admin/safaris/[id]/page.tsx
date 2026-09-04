import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminSafariByIdResult } from "@/lib/cms-data";
import { AdminLoadError } from "@/app/admin/_components/admin-load-error";
import EditSafariForm from "./EditSafariForm";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Safari Package",
};

export default async function SafariEditPage({ params }: Props) {
  const { id } = await params;
  // Fetch data with admin client (bypasses RLS)
  const safariResult = await getAdminSafariByIdResult(id);
  const safari = safariResult.data;

  if (safariResult.error) {
    return (
      <AdminLoadError
        title="Safari package could not be loaded"
        message={safariResult.error}
        code={safariResult.code}
        backHref="/admin/safaris"
        backLabel="Back to safari packages"
      />
    );
  }

  if (!safari && id !== "new") {
    notFound();
  }

  const isNew = id === "new";

  return <EditSafariForm safari={safari} isNew={isNew} />;
}
