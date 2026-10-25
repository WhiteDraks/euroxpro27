"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#E3E0DC] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
        aria-expanded={isOpen}
      >
        <span className={cn(
          "font-medium text-base transition-colors",
          isOpen ? "text-[#741F3D]" : "text-[#101B35] group-hover:text-[#741F3D]"
        )}>
          {question}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "flex-shrink-0 text-[#741F3D] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[500px] pb-4" : "max-h-0"
        )}
      >
        <p className="text-[#5A6478] text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { id: string; question: string; answer: string }[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn("divide-y-0", className)}>
      {items.map((item) => (
        <AccordionItem key={item.id} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
