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
      <div className="bg-[#7D1A30] text-[#FBF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-10 sm:pb-14">
          <h1 className="text-[3rem] leading-[0.92] sm:text-7xl lg:text-[6rem] lg:leading-[0.9] max-w-4xl">{title}</h1>
          {intro && <p className="mt-4 sm:mt-5 text-lg sm:text-xl text-[#F4EDE2] max-w-2xl">{intro}</p>}
        </div>
      </div>
      {children && <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-2">{children}</div>}
      {image && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-12 sm:pb-16">
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
