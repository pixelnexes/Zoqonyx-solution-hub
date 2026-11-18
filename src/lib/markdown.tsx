import * as React from "react";

// A small, safe Markdown renderer. It builds React elements directly (no
// dangerouslySetInnerHTML), so post content can't inject scripts.
// Supports: ## ### headings, paragraphs, - and 1. lists, > quotes, **bold**,
// *italic*, `code`, [links](https://…), and --- rules.

function safeHref(href: string): string | null {
  const h = href.trim();
  if (/^https?:\/\//i.test(h) || h.startsWith("/") || h.startsWith("#") || /^mailto:/i.test(h)) return h;
  return null;
}

function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const tok = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (tok.startsWith("**")) {
      out.push(<strong key={key}>{inline(tok.slice(2, -2), key)}</strong>);
    } else if (tok.startsWith("`")) {
      out.push(
        <code key={key} className="px-1 py-0.5 rounded bg-[#E8ECF1] text-[0.9em]">
          {tok.slice(1, -1)}
        </code>
      );
    } else if (tok.startsWith("[")) {
      const lm = tok.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      const href = lm ? safeHref(lm[2]) : null;
      if (lm && href) {
        const external = /^https?:\/\//i.test(href);
        out.push(
          <a
            key={key}
            href={href}
            className="text-[#0F766E] underline underline-offset-[3px]"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {lm[1]}
          </a>
        );
      } else {
        out.push(tok);
      }
    } else {
      out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    }
    last = idx + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function renderMarkdown(md: string): React.ReactNode {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    const h = line.match(/^(#{2,3})\s+(.+)$/);
    if (h) {
      const level = h[1].length;
      const text = h[2].trim();
      const id = slugifyHeading(text);
      nodes.push(
        level === 2 ? (
          <h2 key={k++} id={id} className="text-2xl font-bold tracking-[-0.015em] mt-10 mb-3 scroll-mt-24">
            {inline(text, `h${k}`)}
          </h2>
        ) : (
          <h3 key={k++} id={id} className="text-xl font-bold mt-7 mb-2 scroll-mt-24">
            {inline(text, `h${k}`)}
          </h3>
        )
      );
      i++;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      nodes.push(<hr key={k++} className="my-8 border-[#D5DCE4]" />);
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      nodes.push(
        <blockquote key={k++} className="my-5 pl-4 border-l-4 border-[#F2C230] text-[#2D3748]">
          {inline(buf.join(" "), `q${k}`)}
        </blockquote>
      );
      continue;
    }

    if (/^\|/.test(line.trim())) {
      const rows: string[][] = [];
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        const cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      nodes.push(
        <div key={k++} className="my-6 overflow-x-auto">
          <table className="w-full text-left text-[15px] border-collapse">
            <thead>
              <tr className="border-b-2 border-[#14213D]">
                {head.map((c, j) => (
                  <th key={j} className="py-2 pr-4 font-semibold">
                    {inline(c, `th${k}-${j}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri} className="border-b border-[#D5DCE4]">
                  {r.map((c, j) => (
                    <td key={j} className="py-2 pr-4 align-top">
                      {inline(c, `td${k}-${ri}-${j}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Fenced code block (``` … ```)
    if (/^```/.test(line.trim())) {
      i++;
      const code: string[] = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) code.push(lines[i++]);
      i++;
      nodes.push(
        <pre key={k++} className="my-5 p-4 rounded-md bg-[#14213D] text-[#F3F5F8] text-sm overflow-x-auto">
          <code>{code.join("\n")}</code>
        </pre>
      );
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+/, ""));
      nodes.push(
        <ul key={k++} className="list-disc pl-6 my-4 space-y-1.5">
          {items.map((it, j) => (
            <li key={j}>{inline(it, `u${k}-${j}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ""));
      nodes.push(
        <ol key={k++} className="list-decimal pl-6 my-4 space-y-1.5">
          {items.map((it, j) => (
            <li key={j}>{inline(it, `o${k}-${j}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph: gather consecutive plain lines.
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{2,3})\s+/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^\|/.test(lines[i].trim()) &&
      !/^```/.test(lines[i].trim()) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      buf.push(lines[i++].trim());
    }
    nodes.push(
      <p key={k++} className="my-4">
        {inline(buf.join(" "), `p${k}`)}
      </p>
    );
  }

  return <>{nodes}</>;
}

/** Plain-text word count, for "x min read". */
export function readingMinutes(md: string): number {
  const words = md.replace(/[#*`>\[\]()_-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Pulls the H2 headings out of Markdown, for a table of contents. */
export function extractHeadings(md: string): { id: string; text: string }[] {
  return md
    .split("\n")
    .map((l) => l.match(/^##\s+(.+)$/))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .map((m) => ({ id: slugifyHeading(m[1].trim()), text: m[1].trim().replace(/[*`]/g, "") }));
}
