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
    <section className={cn("text-[#FBF7F0]", className)}>
      <div className="relative overflow-hidden bg-black text-[#FBF7F0]">
        <div
          aria-hidden="true"
          className="glow pointer-events-none absolute -top-1/2 -left-[10%] h-[200%] w-[90%] max-w-none rounded-full bg-[radial-gradient(closest-side,#A3304A_0%,#7D1A30_40%,rgba(125,26,48,0.3)_65%,transparent_100%)]"
        />
        <div aria-hidden="true" className="drift-b pointer-events-none absolute right-[-10%] top-[-20%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(224,100,125,0.28),transparent)] blur-2xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[6.5rem] sm:pt-[8.5rem] lg:pt-36 pb-12 sm:pb-16">
          <h1 className="rise title-gradient text-[3.2rem] leading-[0.92] sm:text-7xl lg:text-[6.5rem] lg:leading-[0.9] tracking-[-0.045em] max-w-4xl pb-1">{title}</h1>
          {intro && <p className="rise rise-2 mt-4 sm:mt-5 text-lg sm:text-xl text-[#F4EDE2]/85 max-w-2xl">{intro}</p>}
        </div>
      </div>
      {children && <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-2">{children}</div>}
      {image && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-12 sm:pb-16">
          <div className="relative aspect-[4/3] sm:aspect-[21/9] overflow-hidden rounded-[28px] bg-[#141012] border border-white/10 tilt-in">
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
