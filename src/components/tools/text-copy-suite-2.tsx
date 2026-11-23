"use client";

import * as React from "react";
import {
  FileText,
  Mail,
  CheckCircle,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  BookOpen,
  AlignLeft,
  Sliders,
  User,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ==========================================
// 1. AI RESUME BUILDER (ai-resume-builder)
// Client-side structured ATS-friendly resume studio
// ==========================================
export function AiResumeBuilderTool() {
  const [fullName, setFullName] = React.useState("Alex Mercer");
  const [title, setTitle] = React.useState("Senior Full-Stack Engineer");
  const [email, setEmail] = React.useState("alex.mercer@example.com");
  const [phone, setPhone] = React.useState("+1 (555) 349-8201");
  const [location, setLocation] = React.useState("Austin, TX");
  const [summary, setSummary] = React.useState(
    "High-impact software engineer with 7+ years of experience architecting resilient cloud systems, scalable microservices, and reactive web applications. Passionate about automated testing, sub-second latency, and clean code."
  );
  const [experience, setExperience] = React.useState(
    "Lead Engineer | CloudPeak Systems | 2021 - Present\n- Architected high-throughput data processing pipelines handling 40M+ daily events with 99.99% uptime.\n- Reduced cloud hosting spend by 32% via Docker containerization and Kubernetes autoscaling.\n\nSoftware Developer | NexaTech Labs | 2018 - 2021\n- Engineered customer-facing React & TypeScript web applications used by 250,000+ monthly active users."
  );
  const [education, setEducation] = React.useState(
    "B.S. in Computer Science | University of Texas at Austin | 2014 - 2018"
  );
  const [skills, setSkills] = React.useState(
    "TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Docker, Kubernetes, AWS, Git, CI/CD"
  );

  const printResume = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Inputs */}
        <div className="lg:col-span-5 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs max-h-[640px] overflow-y-auto">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            <span>Resume Profile Details</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="text-xs" />
            </div>

            <div className="space-y-1">
              <Label>Target Job Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} className="text-xs" />
            </div>

            <div className="space-y-1">
              <Label>Professional Summary</Label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label>Work Experience (Title | Company | Dates & Bullets)</Label>
              <Textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                rows={6}
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label>Education</Label>
              <Input value={education} onChange={(e) => setEducation(e.target.value)} className="text-xs" />
            </div>

            <div className="space-y-1">
              <Label>Key Technical Skills (Comma-separated)</Label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} className="text-xs" />
            </div>
          </div>
        </div>

        {/* Live ATS Preview */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-semibold text-slate-500">Live ATS Resume Layout</span>
            <Button
              type="button"
              onClick={printResume}
              size="sm"
              className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </Button>
          </div>

          <div
            id="printable-resume"
            className="p-8 rounded-xl border border-border bg-white text-slate-900 shadow-md font-sans text-xs space-y-5 leading-relaxed"
          >
            {/* Header */}
            <div className="border-b pb-4 text-center space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">{fullName}</h2>
              <p className="text-xs font-semibold text-teal-800">{title}</p>
              <p className="text-[11px] text-slate-500 font-mono">
                {email} • {phone} • {location}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-900 border-b pb-0.5">
                Professional Summary
              </h3>
              <p className="text-slate-700 leading-normal">{summary}</p>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-900 border-b pb-0.5">
                Work Experience
              </h3>
              <div className="space-y-3 whitespace-pre-line text-slate-700">
                {experience}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-900 border-b pb-0.5">
                Education
              </h3>
              <p className="text-slate-700">{education}</p>
            </div>

            {/* Skills */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-900 border-b pb-0.5">
                Core Competencies & Technical Skills
              </h3>
              <p className="text-slate-700">{skills}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. AI EMAIL GENERATOR (ai-email-generator)
// ==========================================
export function AiEmailGeneratorTool() {
  const [templateType, setTemplateType] = React.useState("cold_outreach");
  const [recipientName, setRecipientName] = React.useState("Sarah Jenkins");
  const [senderName, setSenderName] = React.useState("Alex Mercer");
  const [companyName, setCompanyName] = React.useState("Acme Enterprise");
  const [topic, setTopic] = React.useState("cloud infrastructure optimization");
  const [tone, setTone] = React.useState("professional");
  const [copied, setCopied] = React.useState(false);

  const emailDraft = React.useMemo(() => {
    switch (templateType) {
      case "cold_outreach":
        return {
          subject: `Exploring synergies for ${companyName}'s ${topic}`,
          body: `Hi ${recipientName},

I hope you're having a productive week.

I noticed ${companyName}'s recent initiatives in ${topic} and wanted to reach out. At Zoqonyx, we help fast-growing teams streamline their technical operations with high-performance browser-based tooling.

Based on your current roadmap, I thought you might appreciate learning how our infrastructure eliminates cloud dependencies and accelerates workflow execution.

Would you be open to a brief 10-minute chat this Thursday to explore if there is a mutual fit?

Best regards,
${senderName}`,
        };

      case "follow_up":
        return {
          subject: `Following up: Next steps on ${topic}`,
          body: `Hi ${recipientName},

Following up on our recent conversation regarding ${topic}.

I wanted to check if you had an opportunity to review the materials we discussed and whether you had any initial questions.

Please let me know how you would like to proceed.

Best regards,
${senderName}`,
        };

      case "resignation":
        return {
          subject: `Formal Notice of Resignation – ${senderName}`,
          body: `Dear ${recipientName},

Please accept this letter as formal notification that I am resigning from my position at ${companyName}. My last day will be two weeks from today.

I am deeply grateful for the opportunities and guidance provided during my tenure with the team. I will do everything possible during the next two weeks to ensure a smooth transition of responsibilities.

I wish ${companyName} and the entire team continued success.

Sincerely,
${senderName}`,
        };

      case "meeting_request":
        return {
          subject: `Quick Sync: Strategy review for ${topic}`,
          body: `Hi ${recipientName},

Could we schedule 20 minutes this week to align on our strategy for ${topic}?

I have availability on Tuesday at 2:00 PM EST or Thursday at 11:00 AM EST. Please let me know which time works best with your calendar.

Looking forward to connecting,
${senderName}`,
        };

      default:
        return { subject: "Update", body: "Hello" };
    }
  }, [templateType, recipientName, senderName, companyName, topic, tone]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4 text-teal-600" />
            <span>Email Parameters</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label>Email Scenario</Label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="cold_outreach">Cold Business Outreach</option>
                <option value="follow_up">Gentle Follow-Up</option>
                <option value="meeting_request">Meeting / Sync Request</option>
                <option value="resignation">Professional Resignation Letter</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Recipient Name</Label>
                <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label>Your Name</Label>
                <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} className="text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Company / Organization</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="text-xs" />
            </div>

            <div className="space-y-1">
              <Label>Core Subject / Topic</Label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} className="text-xs" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-semibold text-slate-500">Drafted Email</span>
            <Button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`Subject: ${emailDraft.subject}\n\n${emailDraft.body}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              size="sm"
              variant="outline"
              className="text-xs h-8 gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Email"}</span>
            </Button>
          </div>

          <div className="p-5 rounded-xl border border-border bg-white shadow-xs space-y-3 text-xs">
            <div className="pb-2 border-b">
              <span className="text-slate-500">Subject: </span>
              <span className="font-semibold text-slate-900">{emailDraft.subject}</span>
            </div>
            <pre className="whitespace-pre-line text-slate-800 font-sans leading-relaxed">
              {emailDraft.body}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. ADVANCED GRAMMAR & PROOFREADING CHECKER (grammar-checker-advanced)
// ==========================================
export function GrammarCheckerAdvancedTool() {
  const [text, setText] = React.useState(
    "In order to optimize our web application, a lot of unnecessary code was written by the previous developers. Basically, at the end of the day, we need to completely utilize modern client-side processing."
  );

  const analysis = React.useMemo(() => {
    const issues: { phrase: string; message: string; type: "wordy" | "cliche" | "passive" }[] = [];

    const wordyPairs = [
      { pattern: /\bin order to\b/gi, suggestion: "to", reason: "Wordy expression. Replace with 'to'." },
      { pattern: /\ba lot of\b/gi, suggestion: "many / numerous", reason: "Informal phrasing in technical prose." },
      { pattern: /\bbasically\b/gi, suggestion: "omit", reason: "Filler word that weakens assertion." },
      { pattern: /\bat the end of the day\b/gi, suggestion: "ultimately", reason: "Overused cliché." },
      { pattern: /\butilize\b/gi, suggestion: "use", reason: "Prefer simpler 'use'." },
      { pattern: /\bcompletely\b/gi, suggestion: "omit", reason: "Potentially redundant intensifier." },
    ];

    wordyPairs.forEach((wp) => {
      const match = text.match(wp.pattern);
      if (match) {
        issues.push({
          phrase: match[0],
          message: wp.reason,
          type: "wordy",
        });
      }
    });

    const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const sentenceCount = Math.max(1, sentences.length);
    const avgWordsPerSentence = Math.round(wordCount / sentenceCount);

    return {
      wordCount,
      sentenceCount,
      avgWordsPerSentence,
      issues,
    };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[11px] font-mono font-semibold text-slate-500">Word Count</span>
          <p className="text-2xl font-semibold text-slate-900 font-mono">{analysis.wordCount}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[11px] font-mono font-semibold text-slate-500">Avg Sentence Length</span>
          <p className="text-2xl font-semibold text-slate-900 font-mono">{analysis.avgWordsPerSentence} Words</p>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[11px] font-mono font-semibold text-slate-500">Flagged Suggestions</span>
          <p className={`text-2xl font-semibold font-mono ${analysis.issues.length === 0 ? "text-emerald-600" : "text-amber-600"}`}>
            {analysis.issues.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-2">
          <Label className="text-xs font-semibold">Enter Text to Proofread</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="text-xs leading-relaxed"
            placeholder="Paste your essay, technical article, or email here..."
          />
        </div>

        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono font-semibold text-slate-500">Editorial Feedback</span>
          {analysis.issues.length === 0 ? (
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-xs text-emerald-800 space-y-1">
              <p className="font-semibold text-emerald-950">Clean Writing Style</p>
              <p>No major clichés or redundant wordy phrases identified in the input text.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {analysis.issues.map((issue, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-amber-200 bg-amber-50/60 text-xs space-y-1">
                  <span className="font-semibold text-amber-900 font-mono">&quot;{issue.phrase}&quot;</span>
                  <p className="text-amber-800 text-[11px]">{issue.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. ARTICLE & LONG-FORM OUTLINER (ai-article-writer / ai-content-writer)
// Honestly described heuristic copywriting & structure generator
// ==========================================
export function AiArticleWriterTool() {
  const [topic, setTopic] = React.useState("Next.js App Router Performance Optimization");
  const [targetAudience, setTargetAudience] = React.useState("Full-Stack Web Developers");
  const [wordCountTarget, setWordCountTarget] = React.useState("1500");
  const [copied, setCopied] = React.useState(false);

  const generatedArticleStructure = React.useMemo(() => {
    return `# Comprehensive Guide: ${topic}

**Target Audience**: ${targetAudience}  
**Target Depth**: ~${wordCountTarget} words  
**Architecture Principle**: 100% Client-Side Efficiency  

---

## 1. Executive Summary & Problem Framing
- Clarify why ${topic} is critical in modern digital production.
- Key bottlenecks: network latency, server cold starts, uncompressed bundles, layout shift.
- The paradigm shift towards zero-upload client-side processing.

---

## 2. Core Architecture & Mental Model
- How modern Web APIs (HTML5 Canvas, WebAssembly, Web Workers) enable hardware acceleration directly in the user's browser.
- Eliminating cloud server bandwidth costs and third-party data vulnerability risks.

---

## 3. Step-by-Step Practical Implementation
### Step 1: Pre-requisites & Environment Setup
- Dependency minimization: avoid bulky npm modules when native browser APIs suffice.

### Step 2: Chunked Stream Processing & Memory Safety
- Processing massive multi-gigabyte files using chunked ArrayBuffers and reactive garbage collection.

### Step 3: Benchmarking & Core Web Vitals
- Measuring LCP (Largest Contentful Paint), CLS (Cumulative Layout Shift), and INP (Interaction to Next Paint).

---

## 4. Common Anti-Patterns to Avoid
1. Unnecessary server roundtrips for operations solvable locally.
2. Blocking the main UI thread during heavy compute loops.
3. Over-promising performance without reproducible benchmark metrics.

---

## 5. Frequently Asked Questions (FAQ)
- **Q: Does this work completely offline?**
  *A: Yes, once loaded via Service Workers, all processing executes locally in browser RAM.*
- **Q: What are the device hardware boundaries?**
  *A: Processing speed scales linearly with local client CPU cores and available system memory.*
`;
  }, [topic, targetAudience, wordCountTarget]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Article Strategy & Parameters</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label>Article Topic / Title</Label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} className="text-xs" />
            </div>

            <div className="space-y-1">
              <Label>Target Audience</Label>
              <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="text-xs" />
            </div>

            <div className="space-y-1">
              <Label>Target Word Count</Label>
              <select
                value={wordCountTarget}
                onChange={(e) => setWordCountTarget(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="800">800 Words (Quick Overview)</option>
                <option value="1500">1,500 Words (In-Depth Technical Guide)</option>
                <option value="3000">3,000 Words (Comprehensive Authority Pillar)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-semibold text-slate-500">Structured Article Outline</span>
            <Button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(generatedArticleStructure);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              size="sm"
              variant="outline"
              className="text-xs h-8 gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Markdown"}</span>
            </Button>
          </div>

          <pre className="p-4 rounded-xl border border-border bg-white text-slate-900 font-mono text-xs overflow-x-auto leading-relaxed max-h-[460px]">
            {generatedArticleStructure}
          </pre>
        </div>
      </div>
    </div>
  );
}
