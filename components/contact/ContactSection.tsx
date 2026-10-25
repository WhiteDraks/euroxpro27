"use client";

import { useState } from "react";
import { Mail, MapPin, Send, User, AlertCircle, Check, Share2, Globe } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { siteConfig, organizingCommittee } from "@/lib/config";

export function ContactSection({
  committee,
  config,
}: {
  committee: typeof organizingCommittee;
  config: typeof siteConfig;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    department: "general",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitted");
  };

  return (
    <div className="py-16 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Organizing Committee Grid */}
        <div className="mb-20">
          <SectionHeader
            eyebrow="Leadership"
            title="The Organizing Committee"
            description="Dedicated AIESEC members coordinating operations, logistics, programmes, and delegate experience for EUROXPRO'27."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {committee.map((member) => (
              <Card key={member.role} className="bg-white p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#101B35] rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <User size={20} className="text-[#741F3D]" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-[#101B35]">{member.name}</h4>
                      <p className="text-xs font-semibold text-[#741F3D]">{member.role}</p>
                    </div>
                  </div>
                  <Badge variant="navy" className="mb-3">{member.department}</Badge>
                  <p className="text-xs text-[#5A6478] leading-relaxed">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

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
                  <p className="text-sm font-medium text-[#101B35]">AIESEC in Türkiye / Istanbul</p>
                  <p className="text-xs text-[#A7AFBF] mt-1 font-mono">Istanbul, Türkiye</p>
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
            <h3 className="font-display font-bold text-2xl text-[#101B35] mb-2">Send a Message</h3>
            <p className="text-xs text-[#5A6478] mb-6">
              Select the appropriate department so your inquiry is routed directly to the responsible team lead.
            </p>

            {status === "submitted" ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h4 className="font-display font-bold text-lg text-[#101B35] mb-2">Message Recorded</h4>
                <p className="text-xs text-[#5A6478] leading-relaxed mb-6">
                  Thank you, {formData.name}. In this demonstration configuration, messages are routed via centralized OC webhooks once production SMTP / Resend API variables are integrated.
                </p>
                <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
                  Send Another Inquiry
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
                    Note: Backend message delivery requires external transactional email configuration (see .env.example).
                  </span>
                </div>

                <Button type="submit" variant="primary" className="w-full text-xs py-2.5">
                  <Send size={13} /> Submit Message to OC
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
