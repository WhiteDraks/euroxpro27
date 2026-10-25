import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  light?: boolean;
  centered?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  light = false,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      {eyebrow && (
        <p className={cn("kicker mb-4", light && "text-[#e58aa6]")}>
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-serif-title font-normal text-[2rem] md:text-5xl lg:text-[3.5rem] leading-[1.05]",
          light ? "text-white" : "text-[#101B35]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base md:text-lg leading-relaxed max-w-2xl",
            light ? "text-[#C9CED8]" : "text-[#4B5563]",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
