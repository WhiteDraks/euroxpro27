"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { ErrorScreen } from "@/components/common/ErrorScreen";

// Shown when something on a page breaks. The menu and footer stay,
// and "Try again" re-renders just the broken part.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      code="Oops"
      title="Something went wrong"
      text="It's not you, it's us. Try again in a moment."
      action={
        <button
          type="button"
          onClick={reset}
          className="glass inline-flex items-center justify-center gap-2 rounded-full font-semibold text-[17px] px-7 h-[52px] hover:bg-white/15 transition-colors"
        >
          <RotateCcw size={19} aria-hidden="true" /> Try again
        </button>
      }
    />
  );
}
