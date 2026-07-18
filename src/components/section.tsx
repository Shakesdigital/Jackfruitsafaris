import type { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
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
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || intro) && (
          <div className="mb-10 max-w-3xl">
            {eyebrow && (
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#2d6f55]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 text-3xl font-black leading-tight text-[#10251b] sm:text-4xl">
                {title}
              </h2>
            )}
            {intro && (
              <p className="mt-4 text-lg leading-8 text-[#536154]">{intro}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
