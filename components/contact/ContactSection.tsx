"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Send, AlertCircle, Check, Share2, Globe, Users, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
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
    <div className="py-16 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Organizing Committee: the full team lives on /team */}
        <Link
          href="/team"
          className="mb-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101B35] text-white rounded-sm p-6 sm:p-8 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#172443] border border-[#233152] rounded-full flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-[#741F3D]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block mb-1">Leadership</span>
              <h2 className="font-serif-title font-normal text-xl sm:text-2xl">Meet the Organizing Committee</h2>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E5E1DA] group-hover:text-white">
            View the team <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        {/* Contact Information & Interactive Form */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <div>
            <SectionHeader
              eyebrow="Direct Inquiries"
              title="Get in Touch"
              description="Reach out directly to the committee or send us an inquiry using the secure form."
            />
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-white border border-[#E3E0DC] rounded-lg">
                <div className="w-10 h-10 bg-[#741F3D]/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-[#741F3D]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#101B35] mb-1">Official Congress Email</h4>
                  <p className="text-xs text-[#5A6478] mb-1">General inquiries &amp; partnerships:</p>
                  <a href={`mailto:${config.contactEmail}`} className="text-sm font-semibold text-[#741F3D] hover:underline">
                    {config.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border border-[#E3E0DC] rounded-lg">
                <div className="w-10 h-10 bg-[#741F3D]/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#741F3D]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#101B35] mb-1">Congress Secretariat</h4>
                  <p className="text-xs text-[#5A6478] mb-1">Host Entity:</p>
                  <p className="text-sm font-medium text-[#101B35]">AIESEC in Türkiye / Antalya</p>
                  <p className="text-xs text-[#A7AFBF] mt-1 font-mono">Antalya, Türkiye</p>
                </div>
              </div>

              <div className="p-5 bg-white border border-[#E3E0DC] rounded-lg">
                <h4 className="font-semibold text-sm text-[#101B35] mb-3">Official Channels</h4>
                <div className="flex gap-3">
                  {config.social.instagram && (
                    <a
                      href={config.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#101B35] text-white rounded-sm text-xs font-semibold hover:bg-[#741F3D] transition-colors"
                    >
                      <Share2 size={14} /> Instagram
                    </a>
                  )}
                  {config.social.linkedin && (
                    <a
                      href={config.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#101B35] text-white rounded-sm text-xs font-semibold hover:bg-[#741F3D] transition-colors"
                    >
                      <Globe size={14} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-[#E3E0DC] rounded-lg p-8">
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
