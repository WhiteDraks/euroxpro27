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
  title,
  description,
  className,
  light = false,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={cn("reveal mb-12", centered && "text-center", className)}>
      <h2
        className={cn(
          "font-serif-title text-[2.1rem] md:text-5xl lg:text-[3.6rem] leading-[1.02]",
          light ? "text-white" : "text-[#FBF7F0]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base md:text-lg leading-relaxed max-w-2xl",
            light ? "text-[#D6C8BC]" : "text-[#D6C8BC]",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
