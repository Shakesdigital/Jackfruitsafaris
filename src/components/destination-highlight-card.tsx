type DestinationHighlight = {
  title: string;
  description: string;
  image_url: string;
};

export function DestinationHighlight({
  highlight,
}: {
  highlight: DestinationHighlight;
}) {
  const { title, description, image_url } = highlight;

  return (
    <article className="overflow-hidden rounded-[var(--brand-radius)] border border-black/10 bg-white shadow-sm">
      <div
        className="img-h-sm bg-cover bg-center sm:img-h-md"
        style={{ backgroundImage: `url(${image_url || ""})` }}
        aria-label={title}
      />
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-fluid-xl font-black text-[var(--foreground)]">
          {title}
        </h3>
        <p className="mt-2 text-fluid-sm leading-7 text-[var(--brand-muted-text)]">
          {description}
        </p>
      </div>
    </article>
  );
}
