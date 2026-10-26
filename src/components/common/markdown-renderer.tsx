"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content?: string | null;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;

  // Normalize string: convert literal escaped \n to real newlines and trim
  const normalized = content.replace(/\\n/g, "\n").trim();

  // Split into structural blocks separated by two or more newlines
  const rawBlocks = normalized.split(/\n{2,}/);

  return (
    <div className={cn("space-y-5 text-sm leading-relaxed text-muted-foreground", className)}>
      {rawBlocks.map((block, blockIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Level 1 Heading in markdown -> render as semantic h2 to preserve single authoritative H1 on page
        if (trimmed.startsWith("# ")) {
          return (
            <h2
              key={blockIdx}
              className="text-2xl sm:text-3xl font-heading font-bold text-foreground tracking-tight pt-4 pb-1 border-b border-border/60"
            >
              {renderInline(trimmed.replace(/^#\s+/, ""))}
            </h2>
          );
        }

        // Level 2 Heading
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={blockIdx}
              className="text-xl sm:text-2xl font-heading font-bold text-foreground tracking-tight pt-3 pb-1"
            >
              {renderInline(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        // Level 3 Heading
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={blockIdx}
              className="text-base sm:text-lg font-heading font-semibold text-foreground pt-2 text-teal-400"
            >
              {renderInline(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        // Level 4 Heading
        if (trimmed.startsWith("#### ")) {
          return (
            <h4
              key={blockIdx}
              className="text-sm sm:text-base font-heading font-semibold text-foreground pt-1"
            >
              {renderInline(trimmed.replace(/^####\s+/, ""))}
            </h4>
          );
        }

        // Blockquote
        if (trimmed.startsWith("> ")) {
          const quoteLines = trimmed
            .split("\n")
            .map((line) => line.replace(/^>\s?/, ""))
            .join(" ");
          return (
            <blockquote
              key={blockIdx}
              className="border-l-2 border-teal-500/70 pl-4 py-1 italic text-muted-foreground/90 bg-muted/20 rounded-r-md text-xs sm:text-sm"
            >
              {renderInline(quoteLines)}
            </blockquote>
          );
        }

        // Unordered List
        if (trimmed.split("\n").every((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "))) {
          const items = trimmed.split("\n").map((line) => line.trim().replace(/^[-*]\s+/, ""));
          return (
            <ul key={blockIdx} className="space-y-1.5 list-none pl-1">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Ordered List
        if (trimmed.split("\n").every((line) => /^\d+\.\s+/.test(line.trim()))) {
          const items = trimmed.split("\n").map((line) => line.trim().replace(/^\d+\.\s+/, ""));
          return (
            <ol key={blockIdx} className="space-y-2 list-none pl-1">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[11px] font-mono font-semibold shrink-0">
                    {itemIdx + 1}
                  </span>
                  <span className="pt-0.5">{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }

        // Standard Paragraph with multi-line breaks
        const lines = trimmed.split("\n");
        return (
          <p key={blockIdx} className="text-xs sm:text-sm leading-relaxed">
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {renderInline(line)}
                {lineIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// Inline formatting helper for bold, italic, code
function renderInline(text: string): React.ReactNode {
  // Split on bold markdown **text**
  const boldParts = text.split(/(\**[^*]+\**)/g);

  return boldParts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Split on inline code `code`
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((sub, j) => {
      if (sub.startsWith("`") && sub.endsWith("`")) {
        return (
          <code
            key={`${i}-${j}`}
            className="px-1.5 py-0.5 rounded bg-muted/60 text-teal-400 font-mono text-[11px] border border-border"
          >
            {sub.slice(1, -1)}
          </code>
        );
      }
      return sub;
    });
  });
}