"use client";

import { useState, useSyncExternalStore } from "react";
import { CheckSquare, Square, RotateCcw } from "lucide-react";
import { checklistItems, checklistCategories } from "@/lib/checklist";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "euroxpro27-checklist";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredItemsSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(STORAGE_KEY) || "[]";
}

function getServerSnapshot(): string {
  return "[]";
}

export function DelegateChecklist() {
  const storedJson = useSyncExternalStore(subscribe, getStoredItemsSnapshot, getServerSnapshot);
  const [localChecked, setLocalChecked] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(storedJson));
    } catch {
      return new Set();
    }
  });

  const toggle = (id: string) => {
    setLocalChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
        window.dispatchEvent(new Event("storage"));
      } catch {}
      return next;
    });
  };

  const reset = () => {
    setLocalChecked(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("storage"));
    } catch {}
  };

  const total = checklistItems.length;
  const done = localChecked.size;
  const percent = Math.round((done / total) * 100);

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8 bg-[#1F1415] border border-[#3A2A2A] rounded-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium text-sm">{done} of {total} items completed</span>
          <span className="text-[#7D1A30] font-bold text-sm">{percent}%</span>
        </div>
        <div className="h-1.5 bg-[#3A2A2A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#7D1A30] rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-[#B8A69C] text-[11px] mt-2">
          Progress is automatically synchronized to your local browser storage.
        </p>
      </div>

      {/* Items by Category */}
      <div className="space-y-6">
        {checklistCategories.map((category) => {
          const items = checklistItems.filter((i) => i.category === category);
          const catDone = items.filter((i) => localChecked.has(i.id)).length;
          return (
            <div key={category} className="bg-[#FBF7F0] border border-[#DCCFBE] rounded-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#DCCFBE] bg-[#F4EDE2]/80">
                <h3 className="text-[#140D0E] font-serif-title font-semibold text-base">{category}</h3>
                <span className="text-[#8C7A72] text-xs">{catDone}/{items.length}</span>
              </div>
              <div className="divide-y divide-[#DCCFBE]">
                {items.map((item) => {
                  const isChecked = localChecked.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={cn(
                        "w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors",
                        isChecked ? "bg-[#7D1A30]/5" : "hover:bg-[#F4EDE2]/40"
                      )}
                    >
                      {isChecked
                        ? <CheckSquare size={16} className="text-[#7D1A30] flex-shrink-0 mt-0.5" />
                        : <Square size={16} className="text-[#B8A69C] flex-shrink-0 mt-0.5" />
                      }
                      <div>
                        <span className={cn(
                          "text-xs font-medium",
                          isChecked ? "text-[#8C7A72] line-through" : "text-[#140D0E]"
                        )}>
                          {item.label}
                        </span>
                        {item.detail && (
                          <p className="text-[#8C7A72] text-[11px] mt-0.5">{item.detail}</p>
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
          <Button variant="ghost" className="text-xs text-[#8C7A72] hover:text-[#140D0E]" onClick={reset}>
            <RotateCcw size={12} /> Reset Checklist
          </Button>
        </div>
      )}
    </div>
  );
}
