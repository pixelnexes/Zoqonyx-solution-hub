"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock, Mic, BookOpen, Copy, CheckCircle2, FileText } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

export function ReadingTimeTool() {
  const [text, setText] = React.useState<string>(
    "Zoqonyx Solution Hub provides high-performance, privacy-first digital utilities designed for creators, software engineers, and digital marketers. Every tool runs 100% inside your web browser without uploading files to remote servers."
  );

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s+/g, "").length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;

  // Reading speeds in words per minute
  const slowReadMin = (words / 180).toFixed(1);
  const avgReadMin = (words / 230).toFixed(1);
  const fastReadMin = (words / 300).toFixed(1);

  // Speaking speeds
  const slowSpeechMin = (words / 130).toFixed(1);
  const avgSpeechMin = (words / 150).toFixed(1);
  const fastSpeechMin = (words / 180).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border bg-card space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Input Article or Speech Text</Label>
            <span className="text-xs text-muted-foreground font-mono">{words} words • {chars} characters</span>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder="Paste your essay, script, or blog post here to calculate exact duration..."
            className="text-xs resize-y"
          />
        </div>

        {/* Speed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Silent Reading Time */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
            <div className="flex items-center gap-2 text-teal-400">
              <BookOpen className="w-5 h-5" />
              <h4 className="font-bold text-sm text-foreground">Silent Reading Time</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg border border-border bg-card text-center">
                <span className="text-[10px] text-muted-foreground block">Slow (180 wpm)</span>
                <span className="text-sm font-bold text-foreground mt-0.5 block">{slowReadMin} min</span>
              </div>
              <div className="p-2.5 rounded-lg border border-teal-500/40 bg-teal-500/5 text-center">
                <span className="text-[10px] text-teal-400 font-bold block">Average (230 wpm)</span>
                <span className="text-sm font-extrabold text-teal-400 mt-0.5 block">{avgReadMin} min</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-card text-center">
                <span className="text-[10px] text-muted-foreground block">Fast (300 wpm)</span>
                <span className="text-sm font-bold text-foreground mt-0.5 block">{fastReadMin} min</span>
              </div>
            </div>
          </div>

          {/* Speaking Time */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
            <div className="flex items-center gap-2 text-teal-400">
              <Mic className="w-5 h-5" />
              <h4 className="font-bold text-sm text-foreground">Speaking / Presentation Time</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg border border-border bg-card text-center">
                <span className="text-[10px] text-muted-foreground block">Slow (130 wpm)</span>
                <span className="text-sm font-bold text-foreground mt-0.5 block">{slowSpeechMin} min</span>
              </div>
              <div className="p-2.5 rounded-lg border border-teal-500/40 bg-teal-500/5 text-center">
                <span className="text-[10px] text-teal-400 font-bold block">Speech (150 wpm)</span>
                <span className="text-sm font-extrabold text-teal-400 mt-0.5 block">{avgSpeechMin} min</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-card text-center">
                <span className="text-[10px] text-muted-foreground block">Fast (180 wpm)</span>
                <span className="text-sm font-bold text-foreground mt-0.5 block">{fastSpeechMin} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Structural Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
          <div className="p-3 rounded-lg border border-border bg-muted/10 text-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Words</span>
            <span className="text-xl font-black text-foreground block mt-0.5">{words}</span>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/10 text-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Sentences</span>
            <span className="text-xl font-black text-foreground block mt-0.5">{sentences}</span>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/10 text-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Paragraphs</span>
            <span className="text-xl font-black text-foreground block mt-0.5">{paragraphs}</span>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/10 text-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Avg Words / Sentence</span>
            <span className="text-xl font-black text-foreground block mt-0.5">
              {sentences > 0 ? (words / sentences).toFixed(1) : words}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
