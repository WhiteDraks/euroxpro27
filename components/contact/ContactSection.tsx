"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Send, AlertCircle, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { siteConfig } from "@/lib/config";

const DEPARTMENTS = [
  { value: "general", label: "General Inquiries" },
  { value: "logistics", label: "Logistics & Travel" },
  { value: "programme", label: "Agenda & Programme" },
  { value: "partnerships", label: "Partnerships & Media" },
];

export function ContactSection({ config }: { config: typeof siteConfig }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    department: "general",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  // Links like /contact?topic=partnerships (the partner card) open the form
  // with the right department already picked.
  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get("topic");
    if (topic && DEPARTMENTS.some((d) => d.value === topic)) {
      // Read after hydration so the static page and the first render match.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((f) => ({ ...f, department: topic }));
    }
  }, []);

  // There is no mail backend yet, so the form opens the visitor's email
  // app with the message filled in instead of silently dropping it.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[EUROXPRO'27 · ${formData.department}] ${formData.subject}`;
    const body = `${formData.message}\n\n— ${formData.name} (${formData.email})`;
    window.location.href = `mailto:${config.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("submitted");
  };

  return (
    <div className="pt-10 sm:pt-14 pb-20 sm:pb-28 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Details */}
          <div>
            <p className="font-serif-title text-2xl sm:text-3xl leading-snug text-[#FBF7F0] max-w-md">
              The quickest way to reach us is by email. We usually reply within a few working days.
            </p>
            <dl className="mt-10 border-b border-white/25">
              <div className="border-t border-white/25 py-5 grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6">
                <dt className="text-sm text-[#B8A69C]">Email</dt>
                <dd>
                  <a href={`mailto:${config.contactEmail}`} className="font-serif-title text-xl sm:text-2xl text-[#E0647D] link-underline break-all">
                    {config.contactEmail}
                  </a>
                  <p className="text-sm text-[#B8A69C] mt-1">General questions and partnerships</p>
                </dd>
              </div>
              <div className="border-t border-white/15 py-5 grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6">
                <dt className="text-sm text-[#B8A69C]">Hosted by</dt>
                <dd className="text-base text-[#FBF7F0]">AIESEC in Türkiye, Antalya</dd>
              </div>
              {(config.social.instagram || config.social.linkedin) && (
                <div className="border-t border-white/15 py-5 grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6">
                  <dt className="text-sm text-[#B8A69C]">Follow</dt>
                  <dd className="flex gap-6 text-base">
                    {config.social.instagram && (
                      <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="text-[#FBF7F0] link-underline hover:text-[#E0647D]">
                        Instagram
                      </a>
                    )}
                    {config.social.linkedin && (
                      <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#FBF7F0] link-underline hover:text-[#E0647D]">
                        LinkedIn
                      </a>
                    )}
                  </dd>
                </div>
              )}
              <div className="border-t border-white/15 py-5 grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6">
                <dt className="text-sm text-[#B8A69C]">The team</dt>
                <dd>
                  <Link href="/team" className="inline-flex items-center gap-2 text-base text-[#FBF7F0] link-underline hover:text-[#E0647D]">
                    Meet the Organizing Committee <ArrowRight size={15} />
                  </Link>
                </dd>
              </div>
            </dl>
          </div>

          {/* Form */}
          <div className="bg-[#141012] p-6 sm:p-8">
            <h2 className="font-serif-title font-normal text-2xl text-[#FBF7F0] mb-2">Send a Message</h2>
            <p className="text-xs text-[#B8A69C] mb-6">
              Select the appropriate department so your inquiry is routed directly to the responsible team lead.
            </p>

            {status === "submitted" ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-green-500/15 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h3 role="status" className="font-serif-title font-normal text-lg text-[#FBF7F0] mb-2">Almost done</h3>
                <p className="text-xs text-[#B8A69C] leading-relaxed mb-6">
                  Thank you, {formData.name}. Your email app should have opened with your message ready to send. Press send there to reach the Organizing Committee, or write to{" "}
                  <a href={`mailto:${config.contactEmail}`} className="text-[#E0647D] font-semibold">{config.contactEmail}</a> directly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-[#FBF7F0] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      maxLength={100}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full text-base sm:text-xs px-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:border-[#7D1A30]"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-[#FBF7F0] mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      id="contact-email"
                      name="email"
                      autoComplete="email"
                      maxLength={200}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full text-base sm:text-xs px-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:border-[#7D1A30]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-department" className="block text-xs font-semibold text-[#FBF7F0] mb-1">Department</label>
                    <select
                      id="contact-department"
                      name="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full text-base sm:text-xs px-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:border-[#7D1A30] bg-[#141012]"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#FBF7F0] mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      id="contact-subject"
                      name="subject"
                      autoComplete="off"
                      maxLength={150}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Visa Support Request"
                      className="w-full text-base sm:text-xs px-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:border-[#7D1A30]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#FBF7F0] mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    id="contact-message"
                      name="message"
                      maxLength={1500}
                      value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your query..."
                    className="w-full text-base sm:text-xs px-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:border-[#7D1A30]"
                  />
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2 text-[11px] text-amber-200">
                  <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Inquiries submitted during the pre-conference phase are reviewed by the Organizing Committee secretariat. For urgent bilateral questions, contact your Member Committee.
                  </span>
                </div>

                <Button type="submit" variant="primary" className="w-full text-xs py-2.5">
                  <Send size={13} /> Send Message to OC
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
