import Image from "next/image";
import { cn } from "@/lib/utils";

// ============================================================
// Opening section shared by the inner pages. A night band that
// echoes the home page: the title over a low horizon with the sun
// half set on the right. Details (children) and the optional wide
// photograph follow on the cream page below.
// ============================================================

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, intro, image, imageAlt, children, className }: PageHeroProps) {
  return (
    <section className={cn("text-[#140D0E]", className)}>
      <div className="relative bg-[#0E0909] text-[#F4EDE2] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(45%_70%_at_85%_100%,rgba(125,26,48,0.55),rgba(14,9,9,0)_70%)]" aria-hidden="true" />
        {/* The sun, half below the horizon line. */}
        <div className="absolute right-[8%] sm:right-[12%] bottom-0 translate-y-[62%] w-28 h-28 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full horizon-sun-static" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-20 sm:pb-24 grid lg:grid-cols-12 gap-6 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <p className="text-sm text-[#E0647D] mb-4 sm:mb-6">{eyebrow}</p>
            <h1 className="text-[3rem] leading-[0.92] sm:text-7xl lg:text-[6rem] lg:leading-[0.9]">{title}</h1>
          </div>
          {intro && (
            <p className="lg:col-span-5 text-base sm:text-lg text-[#E9DED2] leading-relaxed lg:pb-2 max-w-xl relative">
              {intro}
            </p>
          )}
        </div>
        <div className="relative h-px bg-[#E8D5B5]/40" aria-hidden="true" />
      </div>

      {children && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-2">{children}</div>
      )}
      {image && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-12 sm:pb-16">
          <div className="relative aspect-[4/3] sm:aspect-[21/9] overflow-hidden rounded-xl bg-[#140D0E]">
            <Image
              src={image}
              alt={imageAlt ?? ""}
              fill
              preload
              quality={60}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />
          </div>
          {imageAlt && <p className="mt-3 text-sm text-[#6B5B55]">{imageAlt}</p>}
        </div>
      )}
      {children && !image && <div className="pb-8 sm:pb-12" />}
    </section>
  );
}
