"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, AlertCircle, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { siteConfig } from "@/lib/config";

export function ContactSection({ config }: { config: typeof siteConfig }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    department: "general",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

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
    <div className="pb-20 sm:pb-28 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Details */}
          <div>
            <p className="font-serif-title text-2xl sm:text-3xl leading-snug text-[#101B35] max-w-md">
              The quickest way to reach us is by email. We usually reply within a few working days.
            </p>
            <dl className="mt-10 border-b border-[#101B35]">
              <div className="border-t border-[#101B35] py-5 grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6">
                <dt className="text-sm text-[#5A6478]">Email</dt>
                <dd>
                  <a href={`mailto:${config.contactEmail}`} className="font-serif-title text-xl sm:text-2xl text-[#741F3D] link-underline break-all">
                    {config.contactEmail}
                  </a>
                  <p className="text-sm text-[#5A6478] mt-1">General questions and partnerships</p>
                </dd>
              </div>
              <div className="border-t border-[#D9D2C5] py-5 grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6">
                <dt className="text-sm text-[#5A6478]">Hosted by</dt>
                <dd className="text-base text-[#101B35]">AIESEC in Türkiye, Antalya</dd>
              </div>
              {(config.social.instagram || config.social.linkedin) && (
                <div className="border-t border-[#D9D2C5] py-5 grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6">
                  <dt className="text-sm text-[#5A6478]">Follow</dt>
                  <dd className="flex gap-6 text-base">
                    {config.social.instagram && (
                      <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="text-[#101B35] link-underline hover:text-[#741F3D]">
                        Instagram
                      </a>
                    )}
                    {config.social.linkedin && (
                      <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#101B35] link-underline hover:text-[#741F3D]">
                        LinkedIn
                      </a>
                    )}
                  </dd>
                </div>
              )}
              <div className="border-t border-[#D9D2C5] py-5 grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6">
                <dt className="text-sm text-[#5A6478]">The team</dt>
                <dd>
                  <Link href="/team" className="inline-flex items-center gap-2 text-base text-[#101B35] link-underline hover:text-[#741F3D]">
                    Meet the Organizing Committee <ArrowRight size={15} />
                  </Link>
                </dd>
              </div>
            </dl>
          </div>

          {/* Form */}
          <div className="bg-white p-6 sm:p-8">
            <h3 className="font-serif-title font-normal text-2xl text-[#101B35] mb-2">Send a Message</h3>
            <p className="text-xs text-[#5A6478] mb-6">
              Select the appropriate department so your inquiry is routed directly to the responsible team lead.
            </p>

            {status === "submitted" ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h4 className="font-serif-title font-normal text-lg text-[#101B35] mb-2">Almost done</h4>
                <p className="text-xs text-[#5A6478] leading-relaxed mb-6">
                  Thank you, {formData.name}. Your email app should have opened with your message ready to send. Press send there to reach the Organizing Committee, or write to{" "}
                  <a href={`mailto:${config.contactEmail}`} className="text-[#741F3D] font-semibold">{config.contactEmail}</a> directly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#101B35] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full text-xs px-3 py-2 border border-[#E3E0DC] rounded-sm focus:outline-none focus:border-[#741F3D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#101B35] mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full text-xs px-3 py-2 border border-[#E3E0DC] rounded-sm focus:outline-none focus:border-[#741F3D]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#101B35] mb-1">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-[#E3E0DC] rounded-sm focus:outline-none focus:border-[#741F3D] bg-white"
                    >
                      <option value="general">General Inquiries</option>
                      <option value="logistics">Logistics &amp; Travel</option>
                      <option value="programme">Agenda &amp; Programme</option>
                      <option value="partnerships">Partnerships &amp; Media</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#101B35] mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Visa Support Request"
                      className="w-full text-xs px-3 py-2 border border-[#E3E0DC] rounded-sm focus:outline-none focus:border-[#741F3D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#101B35] mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your query..."
                    className="w-full text-xs px-3 py-2 border border-[#E3E0DC] rounded-sm focus:outline-none focus:border-[#741F3D]"
                  />
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-sm p-3 flex items-start gap-2 text-[11px] text-amber-900">
                  <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
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
