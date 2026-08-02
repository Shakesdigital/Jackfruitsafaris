import type { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: SectionProps) {
  return (
    <section className={`section-responsive ${className}`}>
      <div className="container-responsive">
        {(eyebrow || title || intro) && (
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
      </div>
    </section>
  );
}