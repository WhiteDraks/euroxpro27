import Link from "next/link";
import { CalendarDays, ChevronRight, Home, MessageCircleQuestion, Plane } from "lucide-react";

// ============================================================
// One look for every error page (404, crashes, whole-site
// failures): a big code over the burgundy light, one short line,
// and big buttons back to the places people usually want.
// `action` lets a page add its own button, such as "Try again".
// ============================================================

type ErrorScreenProps = {
  code: string;
  title: string;
  text: string;
  action?: React.ReactNode;
  showLinks?: boolean;
};

const shortcuts = [
  { href: "/congress", label: "Congress", icon: CalendarDays },
  { href: "/delegate-guide", label: "Travel guide", icon: Plane },
  { href: "/faq", label: "Questions", icon: MessageCircleQuestion },
];

export function ErrorScreen({ code, title, text, action, showLinks = true }: ErrorScreenProps) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black text-[#FBF7F0] flex items-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="glow absolute left-1/2 top-[-120px] h-[640px] w-[960px] max-w-none -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#A3304A_0%,#7D1A30_38%,rgba(125,26,48,0.3)_62%,transparent_100%)]" />
        <div className="drift-a absolute left-[6%] top-[20%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(224,100,125,0.3),transparent)] blur-2xl" />
        <div className="grid-floor absolute left-1/2 bottom-0 h-[420px] w-[220%] sm:w-[160%] -translate-x-1/2" />
      </div>

      <div className="relative w-full max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-32 text-center flex flex-col items-center">
        <p className="rise title-gradient font-serif-title text-[7rem] sm:text-[11rem] lg:text-[13rem] leading-[0.85] tracking-[-0.06em]">
          {code}
        </p>
        <h1 className="rise rise-2 mt-8 sm:mt-10 text-3xl sm:text-5xl">{title}</h1>
        <p className="rise rise-3 mt-3 text-lg sm:text-xl text-[#F4EDE2]/80 max-w-md">{text}</p>

        <div className="rise rise-4 mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {action}
          <Link
            href="/"
            className="sheen inline-flex items-center justify-center gap-2 rounded-full bg-[#F4EDE2] text-[#7D1A30] font-semibold text-[17px] px-7 h-[52px] hover:bg-white transition-colors"
          >
            <Home size={19} aria-hidden="true" /> Home
          </Link>
        </div>

        {showLinks && (
          <ul className="rise rise-5 mt-10 w-full grid sm:grid-cols-3 gap-3">
            {shortcuts.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="spot glass rounded-[20px] px-5 py-4 flex items-center gap-3 hover:bg-white/10 transition-colors">
                  <span className="w-10 h-10 rounded-[12px] bg-[#7D1A30] flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-white" aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-left font-semibold">{label}</span>
                  <ChevronRight size={18} className="text-white/40" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
