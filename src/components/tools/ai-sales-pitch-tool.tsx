"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sliders,
  Mail,
  PhoneCall,
  Clock,
  Send,
  ShieldAlert,
  Briefcase,
  Layers,
  ChevronRight,
} from "lucide-react";

type FrameworkType = "pas" | "aida" | "bab" | "challenger";

interface PitchPreset {
  product: string;
  prospect: string;
  industry: string;
  painPoint: string;
  solution: string;
  cta: string;
  framework: FrameworkType;
}

const PRESETS: Record<string, PitchPreset> = {
  saas: {
    product: "SyncMetrics Automated Revenue Intelligence",
    prospect: "VP of Sales / Chief Revenue Officer",
    industry: "B2B SaaS & Tech",
    painPoint: "Sales reps wasting 12+ hours/week manually logging CRM data while pipeline forecasts miss targets by 30%",
    solution: "Bi-directional AI synchronization that logs calls and emails automatically with 98% forecasting accuracy",
    cta: "15-minute no-pitch pipeline audit",
    framework: "pas",
  },
  cyber: {
    product: "ShieldGuard SOC2 & HIPAA Compliance Suite",
    prospect: "Chief Information Security Officer (CISO) / CTO",
    industry: "FinTech & Healthcare",
    painPoint: "Failing enterprise security reviews or waiting 6+ months to achieve compliance before closing large deals",
    solution: "Continuous automated audit readiness that closes security questionnaires in hours instead of months",
    cta: "Complimentary gap analysis checklist",
    framework: "challenger",
  },
  recruiting: {
    product: "Apex Executive AI Talent Search",
    prospect: "Founder / Head of People",
    industry: "High-Growth Scaleups",
    painPoint: "Burning $40k+ per month on open senior engineering roles that remain unfilled for 90+ days",
    solution: "Vetted top 1% tech leaders delivered to your interview pipeline within 14 business days guaranteed",
    cta: "Review 3 pre-vetted candidate profiles this Thursday",
    framework: "bab",
  },
};

interface PitchBundle {
  coldEmail: {
    subjectLines: string[];
    body: string;
  };
  elevatorPitch: string;
  linkedinDm: string;
  coldCallScript: {
    intro: string;
    hook: string;
    qualify: string;
    objections: { trigger: string; response: string }[];
  };
  followUp: {
    day3: string;
    day7: string;
    day14Breakup: string;
  };
}

export function AiSalesPitchTool() {
  const [product, setProduct] = useState("");
  const [prospect, setProspect] = useState("");
  const [industry, setIndustry] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [solution, setSolution] = useState("");
  const [cta, setCta] = useState("");
  const [framework, setFramework] = useState<FrameworkType>("pas");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pitch, setPitch] = useState<PitchBundle | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"email" | "elevator" | "linkedin" | "call" | "followup">("email");

  const applyPreset = (key: keyof typeof PRESETS) => {
    const p = PRESETS[key];
    setProduct(p.product);
    setProspect(p.prospect);
    setIndustry(p.industry);
    setPainPoint(p.painPoint);
    setSolution(p.solution);
    setCta(p.cta);
    setFramework(p.framework);
  };

  const clearForm = () => {
    setProduct("");
    setProspect("");
    setIndustry("");
    setPainPoint("");
    setSolution("");
    setCta("");
    setPitch(null);
  };

  const handleGenerate = () => {
    if (!product.trim() || !painPoint.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const prospectRole = prospect.trim() || "decision maker";
      const industryName = industry.trim() || "modern industry leaders";
      const ctaAction = cta.trim() || "a quick 10-minute discovery call";

      // Build High-Converting Output
      const generated: PitchBundle = {
        coldEmail: {
          subjectLines: [
            `Quick question regarding ${industryName} pipeline efficiency`,
            `Fixing ${painPoint.slice(0, 32)}...`,
            `Idea for {{company_name}}'s team (re: ${product.slice(0, 24)})`,
          ],
          body: `Hi {{first_name}},\n\nI noticed you are leading the team at {{company_name}}. Most ${prospectRole}s we speak with in ${industryName} tell us that ${painPoint.toLowerCase()}.\n\nWe built ${product} to change that. By using ${solution.toLowerCase()}, our partners typically eliminate this friction in under 14 days without disrupting existing workflows.\n\nOpen to ${ctaAction} next Tuesday at 2:00 PM to see how this compares to your current setup?\n\nBest regards,\n[Your Name]\n[Your Title]`,
        },
        elevatorPitch: `You know how ${prospectRole}s in ${industryName} constantly struggle because ${painPoint.toLowerCase()}? What we do at ${product} is provide ${solution.toLowerCase()}. In fact, we recently helped a peer team achieve this, and they were able to completely eliminate the bottleneck within 30 days. Would you be open to exploring what that could look like for {{company_name}}?`,
        linkedinDm: `Hey {{first_name}} — saw your profile while researching forward-thinking teams in ${industryName}.\n\nA lot of ${prospectRole}s are feeling the pain right now where ${painPoint.toLowerCase()}.\n\nWe created ${product} which helps teams achieve ${solution.toLowerCase()}.\n\nNo pitch — just wanted to see if solving this is on your radar this quarter? If so, I'd love to share our 2-page benchmark breakdown. Let me know!`,
        coldCallScript: {
          intro: `"Hi {{first_name}}, this is [Your Name] with ${product}. I know I caught you out of the blue — do you have 30 seconds for me to tell you why I called, and then you can tell me if it makes sense to keep talking?"`,
          hook: `"We work with ${prospectRole}s across ${industryName}. The #1 challenge we hear over and over is that ${painPoint.toLowerCase()}. We developed a way to ${solution.toLowerCase()}."`,
          qualify: `"How is {{company_name}} currently tackling this, or is that primarily managed internally?"`,
          objections: [
            {
              trigger: `"We already have a solution / tool for this."`,
              response: `"That makes total sense — most established teams already have something in place. We actually don't replace your primary stack; we plug in to eliminate the manual gap so you get 100% of the ROI out of what you already own. Would it hurt to spend 10 minutes seeing the side-by-side performance data?"`,
            },
            {
              trigger: `"Just send me an email with information."`,
              response: `"I'd be happy to send that over. I have a 2-page brief specifically on how ${industryName} teams tackle this. What's the best email address, and so I don't flood your inbox with irrelevant slides, is your biggest priority this month fixing [Key Pain Point] or something else?"`,
            },
            {
              trigger: `"We don't have budget right now."`,
              response: `"Totally respect that, {{first_name}}. I'm not asking for budget today. Most of our partners started the conversation during planning cycles so they knew what options were available when funds unlocked. If we could prove a 4x ROI before you ever spend a dime, would you be against a 15-minute preview?"`,
            },
          ],
        },
        followUp: {
          day3: `Hi {{first_name}},\n\nFollowing up on my note from earlier this week. I know your calendar is packed.\n\nHere is a 60-second summary: ${product} helps ${industryName} teams solve ${painPoint.toLowerCase()} by ${solution.toLowerCase()}.\n\nDo you have 10 minutes this Thursday or Friday for ${ctaAction}?`,
          day7: `Hi {{first_name}},\n\nThought you might find this relevant — we just published a case study detailing how another ${prospectRole} handled ${painPoint.toLowerCase()} and saw immediate results within 3 weeks.\n\nWould it be helpful if I sent over the PDF summary?`,
          day14Breakup: `Hi {{first_name}},\n\nI haven't heard back, which usually means either this isn't a priority right now, or you already have it completely sorted out (both totally fine!).\n\nI won't follow up again regarding ${product}. If you ever want to revisit how we can ${solution.toLowerCase()}, feel free to reach back out anytime.\n\nWishing you and {{company_name}} all the best this quarter!`,
        },
      };

      setPitch(generated);
      setActiveTab("email");
      setIsGenerating(false);
    }, 400);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadPitchDeck = () => {
    if (!pitch) return;
    const content = `# Full B2B Sales Pitch Playbook: ${product}
**Target Role**: ${prospect || "Decision Maker"}
**Industry**: ${industry || "Enterprise"}
**Framework**: ${framework.toUpperCase()}
**Generated by**: Zoqonyx AI Sales Pitch Studio

---

## 1. COLD EMAIL OUTREACH
### Subject Lines:
${pitch.coldEmail.subjectLines.map((s, i) => `${i + 1}. ${s}`).join("\n")}

### Email Body:
${pitch.coldEmail.body}

---

## 2. 30-SECOND ELEVATOR PITCH
${pitch.elevatorPitch}

---

## 3. LINKEDIN DM / INMAIL
${pitch.linkedinDm}

---

## 4. COLD CALL SCRIPT & OBJECTION HANDLING
### Opener:
${pitch.coldCallScript.intro}

### Hook:
${pitch.coldCallScript.hook}

### Qualification:
${pitch.coldCallScript.qualify}

### Common Objection Handlers:
${pitch.coldCallScript.objections.map((o) => `#### Objection: ${o.trigger}\nResponse: ${o.response}\n`).join("\n")}

---

## 5. MULTI-TOUCH FOLLOW-UP SEQUENCE
### Day 3:
${pitch.followUp.day3}

### Day 7:
${pitch.followUp.day7}

### Day 14 (Breakup):
${pitch.followUp.day14Breakup}
`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${product.toLowerCase().replace(/[^a-z0-9]/g, "-")}-sales-playbook.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Client-Side B2B Sales Studio
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          Sales Pitch & Cold Outreach Playbook Generator
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          Client-side algorithmic B2B sales playbook generator. Generate multi-framework cold emails, 30s elevator pitches, LinkedIn InMails, cold call scripts, and objection matrices with 100% data privacy.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="bg-slate-100 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-500" /> B2B Presets:
        </span>
        <button
          onClick={() => applyPreset("saas")}
          className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-600 font-medium transition"
        >
          💼 B2B SaaS Revenue
        </button>
        <button
          onClick={() => applyPreset("cyber")}
          className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-600 font-medium transition"
        >
          🛡️ SOC2 / Cybersecurity
        </button>
        <button
          onClick={() => applyPreset("recruiting")}
          className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-600 font-medium transition"
        >
          🚀 Executive Search
        </button>
        <button
          onClick={clearForm}
          className="ml-auto text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-5 space-y-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-500" /> Deal Parameters
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Product / Service / Solution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g. SyncMetrics Automated Revenue Platform"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={prospect}
                onChange={(e) => setProspect(e.target.value)}
                placeholder="e.g. VP of Sales"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. B2B SaaS"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Core Pain Point / Challenge <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={painPoint}
              onChange={(e) => setPainPoint(e.target.value)}
              placeholder="e.g. Sales reps wasting 12+ hours/week manually logging CRM records"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Solution / Key Value Metric
            </label>
            <textarea
              rows={3}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="e.g. Automated real-time CRM syncing with 98% forecasting accuracy"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Call to Action (CTA)
              </label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder="e.g. 15-minute quick audit"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pitch Framework
              </label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value as FrameworkType)}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-medium"
              >
                <option value="pas">PAS (Problem, Agitate, Solve)</option>
                <option value="aida">AIDA (Attention, Interest, Desire, Action)</option>
                <option value="bab">BAB (Before-After-Bridge)</option>
                <option value="challenger">The Challenger Insight Pitch</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!product.trim() || !painPoint.trim() || isGenerating}
            className="w-full py-3 bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-50 text-white rounded-xl font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" /> Generating Sales Playbook...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate Sales Playbook
              </>
            )}
          </button>
        </div>

        {/* Right Output: Multi-Format Sales Playbook */}
        <div className="lg:col-span-7 space-y-4">
          {!pitch ? (
            <div className="h-full min-h-[460px] bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-3">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                Ready to Generate Pitch Materials
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Enter your product and prospect details, or select one of the high-converting presets to generate cold emails, elevator pitches, and cold call scripts.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
              {/* Channel Tabs */}
              <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-2.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("email")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === "email"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" /> Cold Email
                  </button>
                  <button
                    onClick={() => setActiveTab("elevator")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === "elevator"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Elevator Pitch (30s)
                  </button>
                  <button
                    onClick={() => setActiveTab("linkedin")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === "linkedin"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" /> LinkedIn DM
                  </button>
                  <button
                    onClick={() => setActiveTab("call")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === "call"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Cold Call Script
                  </button>
                  <button
                    onClick={() => setActiveTab("followup")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === "followup"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> Follow-Up (3-Touch)
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={downloadPitchDeck}
                    className="px-2.5 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-md font-medium transition flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Playbook
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="p-6 space-y-5 text-left">
                {/* 1. COLD EMAIL */}
                {activeTab === "email" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                        High-Open Subject Line Options
                      </span>
                      <div className="space-y-1.5">
                        {pitch.coldEmail.subjectLines.map((subj, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200"
                          >
                            <span>{subj}</span>
                            <button
                              onClick={() => copyText(subj, `subj-${idx}`)}
                              className="text-slate-400 hover:text-emerald-600 transition"
                            >
                              {copiedId === `subj-${idx}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                          Email Body
                        </span>
                        <button
                          onClick={() => copyText(pitch.coldEmail.body, "email-body")}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          {copiedId === "email-body" ? (
                            <>
                              <Check className="w-3 h-3" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Email
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                        {pitch.coldEmail.body}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ELEVATOR PITCH */}
                {activeTab === "elevator" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                        30-Second Verbal Elevator Pitch
                      </span>
                      <button
                        onClick={() => copyText(pitch.elevatorPitch, "elevator")}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        {copiedId === "elevator" ? (
                          <>
                            <Check className="w-3 h-3" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Pitch
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      &ldquo;{pitch.elevatorPitch}&rdquo;
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      💡 <strong>Pro Tip for Verbal Delivery:</strong> Speak at an unhurried pace (approx. 130 words per minute). Pause right after stating the problem to let the prospect subconsciously nod before presenting your solution.
                    </div>
                  </div>
                )}

                {/* 3. LINKEDIN DM */}
                {activeTab === "linkedin" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                        LinkedIn InMail / Direct Message (Under 100 Words)
                      </span>
                      <button
                        onClick={() => copyText(pitch.linkedinDm, "linkedin")}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        {copiedId === "linkedin" ? (
                          <>
                            <Check className="w-3 h-3" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy DM
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                      {pitch.linkedinDm}
                    </div>
                  </div>
                )}

                {/* 4. COLD CALL SCRIPT */}
                {activeTab === "call" && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                        1. Pattern-Interrupt Opener
                      </span>
                      <p className="mt-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium">
                        {pitch.coldCallScript.intro}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                        2. The Problem Hook & Value Bridge
                      </span>
                      <p className="mt-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
                        {pitch.coldCallScript.hook}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                        3. Qualification Question
                      </span>
                      <p className="mt-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 italic">
                        {pitch.coldCallScript.qualify}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Objection Handling Matrix
                      </span>
                      {pitch.coldCallScript.objections.map((obj, i) => (
                        <div
                          key={i}
                          className="p-3 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40 rounded-xl space-y-1"
                        >
                          <div className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                            Prospect: {obj.trigger}
                          </div>
                          <div className="text-xs text-slate-700 dark:text-slate-300">
                            <strong>Your Turn:</strong> {obj.response}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. FOLLOW UP SEQUENCE */}
                {activeTab === "followup" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase text-blue-600 dark:text-blue-400">
                          Touch 2: Day 3 Gentle Nudge
                        </span>
                        <button
                          onClick={() => copyText(pitch.followUp.day3, "f-day3")}
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          {copiedId === "f-day3" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                        </button>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs whitespace-pre-line text-slate-800 dark:text-slate-200">
                        {pitch.followUp.day3}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                          Touch 3: Day 7 Value Add (Case Study / Proof)
                        </span>
                        <button
                          onClick={() => copyText(pitch.followUp.day7, "f-day7")}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          {copiedId === "f-day7" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                        </button>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs whitespace-pre-line text-slate-800 dark:text-slate-200">
                        {pitch.followUp.day7}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase text-rose-600 dark:text-rose-400">
                          Touch 4: Day 14 Permission to Close File (Breakup)
                        </span>
                        <button
                          onClick={() => copyText(pitch.followUp.day14Breakup, "f-day14")}
                          className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                        >
                          {copiedId === "f-day14" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                        </button>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs whitespace-pre-line text-slate-800 dark:text-slate-200">
                        {pitch.followUp.day14Breakup}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
