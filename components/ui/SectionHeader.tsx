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
        <p
          className={cn(
            "text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-[#741F3D]"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-serif-title font-normal text-3xl md:text-4xl lg:text-5xl leading-tight",
          light ? "text-white" : "text-[#101B35]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base md:text-lg leading-relaxed max-w-2xl",
            light ? "text-[#A7AFBF]" : "text-[#5A6478]",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
