import { Mail, Phone } from "lucide-react";
import type { TeamMember } from "@/lib/content";
import { cn } from "@/lib/utils";
import { TEAM_CONTACT_KEYS, teamContactHref, teamContactLabel, type TeamContactKey } from "@/lib/team-contact";

// lucide-react has no brand icons, so these two are simple outlines drawn here.
function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
      <path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6M11.5 13a2.5 2.5 0 0 1 5 0v3.5" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5v.01" />
    </svg>
  );
}

const ICONS: Record<TeamContactKey, React.ReactNode> = {
  email: <Mail size={18} aria-hidden="true" />,
  phone: <Phone size={18} aria-hidden="true" />,
  linkedin: <LinkedInIcon />,
  instagram: <InstagramIcon />,
};

const NAMES: Record<TeamContactKey, string> = {
  email: "E-mail",
  phone: "Call",
  linkedin: "LinkedIn",
  instagram: "Instagram",
};

// Round icon buttons under a member's role. Empty or invalid details are skipped.
export function MemberContacts({ member, onBrand = false }: { member: TeamMember; onBrand?: boolean }) {
  const name = member.name.trim() || member.role;
  const links = TEAM_CONTACT_KEYS.flatMap((key) => {
    const raw = member[key] ?? "";
    const href = teamContactHref(key, raw);
    return href ? [{ key, href, label: teamContactLabel(key, raw) }] : [];
  });
  if (links.length === 0) return null;

  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {links.map(({ key, href, label }) => {
        const external = key === "linkedin" || key === "instagram";
        return (
          <li key={key}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              title={label}
              aria-label={`${NAMES[key]} ${name}: ${label}`}
              className={cn(
                "w-11 h-11 rounded-full inline-flex items-center justify-center transition-colors",
                onBrand ? "bg-white/15 text-white hover:bg-white/25" : "bg-white/[0.06] text-[#F4EDE2] hover:bg-[#7D1A30]"
              )}
            >
              {ICONS[key]}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
