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
      <div className="mb-8 bg-[#172443] border border-[#2A3556] rounded-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium text-sm">{done} of {total} items completed</span>
          <span className="text-[#741F3D] font-bold text-sm">{percent}%</span>
        </div>
        <div className="h-1.5 bg-[#2A3556] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#741F3D] rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-[#A7AFBF] text-[11px] mt-2">
          Progress is automatically synchronized to your local browser storage.
        </p>
      </div>

      {/* Items by Category */}
      <div className="space-y-6">
        {checklistCategories.map((category) => {
          const items = checklistItems.filter((i) => i.category === category);
          const catDone = items.filter((i) => localChecked.has(i.id)).length;
          return (
            <div key={category} className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E1DA] bg-[#F7F3ED]/80">
                <h3 className="text-[#101B35] font-serif-title font-semibold text-base">{category}</h3>
                <span className="text-[#8F9AA0] text-xs font-mono">{catDone}/{items.length}</span>
              </div>
              <div className="divide-y divide-[#E5E1DA]">
                {items.map((item) => {
                  const isChecked = localChecked.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={cn(
                        "w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors",
                        isChecked ? "bg-[#741F3D]/5" : "hover:bg-[#F7F3ED]/40"
                      )}
                    >
                      {isChecked
                        ? <CheckSquare size={16} className="text-[#741F3D] flex-shrink-0 mt-0.5" />
                        : <Square size={16} className="text-[#A7AFBF] flex-shrink-0 mt-0.5" />
                      }
                      <div>
                        <span className={cn(
                          "text-xs font-medium",
                          isChecked ? "text-[#8F9AA0] line-through" : "text-[#101B35]"
                        )}>
                          {item.label}
                        </span>
                        {item.detail && (
                          <p className="text-[#8F9AA0] text-[11px] mt-0.5">{item.detail}</p>
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
          <Button variant="ghost" className="text-xs text-[#8F9AA0] hover:text-[#101B35]" onClick={reset}>
            <RotateCcw size={12} /> Reset Checklist
          </Button>
        </div>
      )}
    </div>
  );
}
