import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#101B35] flex items-center justify-center px-4 py-24">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-[#741F3D]/20 border border-[#741F3D]/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <Compass size={32} className="text-[#741F3D]" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#741F3D] mb-2">404 Error</p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
          Route Not Found
        </h1>
        <p className="text-[#A7AFBF] text-sm leading-relaxed mb-8">
          The congress hub page you are seeking does not exist or may have been relocated. Return to the main congress portal to navigate.
        </p>
        <Link href="/">
          <Button variant="primary">
            <ArrowLeft size={16} /> Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
