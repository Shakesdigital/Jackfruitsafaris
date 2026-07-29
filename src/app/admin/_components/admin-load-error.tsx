import Link from "next/link";

type AdminLoadErrorProps = {
  title: string;
  message: string;
  code?: string;
  backHref: string;
  backLabel: string;
};

export function AdminLoadError({
  title,
  message,
  code,
  backHref,
  backLabel,
}: AdminLoadErrorProps) {
  return (
    <div className="max-w-3xl rounded-lg border border-red-200 bg-red-50 p-6">
      <h1 className="text-xl font-semibold text-red-950">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-red-900">{message}</p>
      {code && (
        <p className="mt-3 font-mono text-xs text-red-800">
          Supabase code: {code}
        </p>
      )}
      <p className="mt-4 text-sm text-red-900">
        Check the Netlify function logs for the matching
        <span className="font-mono"> Admin CMS fetch </span>
        entry if this appears in production.
      </p>
      <Link
        href={backHref}
        className="mt-5 inline-flex rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
      >
        {backLabel}
      </Link>
    </div>
  );
}
