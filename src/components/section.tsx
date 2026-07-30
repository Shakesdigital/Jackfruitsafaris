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
    <section className={`py-[var(--section-spacing)] ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || intro) && (
          <div className="mb-10 max-w-3xl">
            {eyebrow && (
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--brand-secondary)]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 text-3xl font-black leading-tight text-[var(--foreground)] sm:text-4xl">
                {title}
              </h2>
            )}
            {intro && (
              <div className="mt-4 text-lg leading-8 text-[var(--brand-muted-text)]">{intro}</div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
