import Image from "next/image";
import { cn } from "@/lib/utils";

// ============================================================
// Opening section shared by the inner pages: a large headline on
// the paper background with the intro set beside it, and an
// optional wide photograph underneath.
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
    <section className={cn("bg-[#F7F3ED] text-[#101B35]", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-10 sm:pb-14">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end border-b border-[#101B35] pb-10 sm:pb-14">
          <div className="lg:col-span-7">
            <p className="kicker mb-4 sm:mb-6">{eyebrow}</p>
            <h1 className="font-serif-title font-normal text-[2.6rem] leading-[1] sm:text-7xl lg:text-[5.25rem] lg:leading-[0.95]">
              {title}
            </h1>
          </div>
          {intro && (
            <p className="lg:col-span-5 text-base sm:text-lg text-[#374151] leading-relaxed lg:pb-2">
              {intro}
            </p>
          )}
        </div>
        {children && <div className="pt-6 sm:pt-8">{children}</div>}
      </div>
      {image && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="relative aspect-[4/3] sm:aspect-[21/9] overflow-hidden bg-[#101B35]">
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
          {imageAlt && <p className="mt-3 text-xs text-[#5A6478] italic">{imageAlt}</p>}
        </div>
      )}
    </section>
  );
}
