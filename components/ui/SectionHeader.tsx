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
        <p className={cn("kicker mb-4", light && "text-[#E0647D]")}>
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-serif-title text-[2.1rem] md:text-5xl lg:text-[3.6rem] leading-[1.02]",
          light ? "text-white" : "text-[#140D0E]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base md:text-lg leading-relaxed max-w-2xl",
            light ? "text-[#D6C8BC]" : "text-[#4B5563]",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
