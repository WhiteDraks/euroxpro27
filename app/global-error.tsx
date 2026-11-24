"use client";

import "./globals.css";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { ErrorScreen } from "@/components/common/ErrorScreen";

// Last line of defence: used when even the site frame (menu, footer)
// fails to load, so it brings its own <html> and <body>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-black">
        <ErrorScreen
          code="500"
          title="The site is taking a break"
          text="We're on it. Please try again in a minute."
          showLinks={false}
          action={
            <button
              type="button"
              onClick={reset}
              className="glass inline-flex items-center justify-center gap-2 rounded-full font-semibold text-[17px] px-7 h-[52px] text-[#FBF7F0] hover:bg-white/15 transition-colors"
            >
              <RotateCcw size={19} aria-hidden="true" /> Try again
            </button>
          }
        />
      </body>
    </html>
  );
}
