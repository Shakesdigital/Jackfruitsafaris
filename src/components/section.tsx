import type { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
  /** Optional image rendered on the right side of the intro text on desktop */
  introImage?: string;
  children: ReactNode;
  className?: string;
};

export function Section({
  eyebrow,
  title,
  intro,
  introImage,
  children,
  className = "",
}: SectionProps) {
  const hasIntroHeader = Boolean(eyebrow || title || intro);
  const hasIntroImage = Boolean(introImage);

  return (
    <section className={`section-responsive ${className}`}>
      <div className="container-responsive">
        {hasIntroImage ? (
          // Two-column layout: intro text left, image right (desktop)
          <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <div>
              {hasIntroHeader && (
                <div className="mb-6 max-w-3xl">
                  {eyebrow && (
                    <p className="text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-secondary)]">
                      {eyebrow}
                    </p>
                  )}
                  {title && (
                    <h2 className="mt-3 text-fluid-3xl font-black leading-fluid-tight text-[var(--foreground)]">
                      {title}
                    </h2>
                  )}
                  {intro && (
                    <div className="mt-4 text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]">{intro}</div>
                  )}
                </div>
              )}
              {children}
            </div>
            <img
              src={introImage}
              alt=""
              className="aspect-[4/3] w-full max-w-sm rounded-[var(--brand-radius)] object-cover shadow-lg"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        ) : (
          // Original single-column layout (backward compatible)
          <>
            {hasIntroHeader && (
              <div className="mb-10 max-w-3xl">
                {eyebrow && (
                  <p className="text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-secondary)]">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h2 className="mt-3 text-fluid-3xl font-black leading-fluid-tight text-[var(--foreground)]">
                    {title}
                  </h2>
                )}
                {intro && (
                  <div className="mt-4 text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]">{intro}</div>
                )}
              </div>
            )}
            {children}
          </>
        )}
      </div>
    </section>
  );
}