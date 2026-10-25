"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Square, RotateCcw } from "lucide-react";
import { checklistItems, checklistCategories } from "@/lib/checklist";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "euroxpro27-checklist";

export function DelegateChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  };

  const reset = () => {
    setChecked(new Set());
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const total = checklistItems.length;
  const done = checked.size;
  const percent = Math.round((done / total) * 100);

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8 bg-[#172443] border border-[#2A3556] rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold">{done} of {total} items completed</span>
          <span className="text-[#741F3D] font-bold">{percent}%</span>
        </div>
        <div className="h-2 bg-[#2A3556] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#741F3D] rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        {mounted && (
          <p className="text-[#A7AFBF] text-xs mt-2">
            Progress saved in your browser storage. Reset anytime below.
          </p>
        )}
      </div>

      {/* Items by Category */}
      <div className="space-y-6">
        {checklistCategories.map((category) => {
          const items = checklistItems.filter((i) => i.category === category);
          const catDone = items.filter((i) => checked.has(i.id)).length;
          return (
            <div key={category} className="bg-[#172443] border border-[#2A3556] rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#2A3556] bg-[#1a2a50]">
                <h3 className="text-white font-semibold text-sm tracking-wide">{category}</h3>
                <span className="text-[#A7AFBF] text-xs">{catDone}/{items.length}</span>
              </div>
              <div className="divide-y divide-[#2A3556]">
                {items.map((item) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={cn(
                        "w-full flex items-start gap-3 px-5 py-4 text-left transition-colors",
                        isChecked ? "bg-[#741F3D]/5" : "hover:bg-white/5"
                      )}
                    >
                      {isChecked
                        ? <CheckSquare size={18} className="text-[#741F3D] flex-shrink-0 mt-0.5" />
                        : <Square size={18} className="text-[#A7AFBF] flex-shrink-0 mt-0.5" />
                      }
                      <div>
                        <span className={cn(
                          "text-sm font-medium",
                          isChecked ? "text-[#A7AFBF] line-through" : "text-white"
                        )}>
                          {item.label}
                        </span>
                        {item.detail && (
                          <p className="text-[#A7AFBF] text-xs mt-0.5">{item.detail}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {done > 0 && (
        <div className="mt-6 text-center">
          <Button variant="ghost" className="text-[#A7AFBF] hover:text-white" onClick={reset}>
            <RotateCcw size={14} /> Reset Checklist
          </Button>
        </div>
      )}
    </div>
  );
}
