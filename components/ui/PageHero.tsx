import Image from "next/image";
import { cn } from "@/lib/utils";

// ============================================================
// Opening of every inner page: a big title and one short line.
// `eyebrow` is still accepted (pages and /admin pass it) but not
// shown, to keep the top of each page as simple as possible.
// ============================================================

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageHero({ title, intro, image, imageAlt, children, className }: PageHeroProps) {
  return (
    <section className={cn("text-[#140D0E]", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-8 sm:pb-10">
        <h1 className="text-[3rem] leading-[0.92] sm:text-7xl lg:text-[6rem] lg:leading-[0.9] max-w-4xl">{title}</h1>
        {intro && <p className="mt-4 sm:mt-5 text-lg sm:text-xl text-[#4B3F3B] max-w-2xl">{intro}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
      {image && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="relative aspect-[4/3] sm:aspect-[21/9] overflow-hidden rounded-3xl bg-[#140D0E]">
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
        </div>
      )}
    </section>
  );
}
