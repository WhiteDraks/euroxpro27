import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#F7F3ED] text-[#101B35] pt-32 sm:pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="kicker mb-4">Page not found</p>
        <h1 className="font-serif-title font-normal text-5xl sm:text-7xl leading-[1] max-w-3xl">
          This page seems to have wandered off into Kaleiçi.
        </h1>
        <p className="text-[#4B5563] text-base sm:text-lg leading-relaxed mt-6 max-w-xl">
          The link may be old or mistyped. The home page will get you back on track.
        </p>
        <Link href="/" className="inline-block mt-8">
          <Button variant="secondary" size="lg">
            Back to the home page <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
