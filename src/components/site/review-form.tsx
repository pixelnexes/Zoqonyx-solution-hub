"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const field =
  "w-full rounded-xl border border-[#E7E1F6] bg-[#FAF8FF] px-3.5 py-2.5 text-[15px] text-[#1B1340] placeholder:text-[#7B7699] focus:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#7C3AED]";

export function ReviewForm() {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [status, setStatus] = React.useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rating }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setStatus("done");
      form.reset();
      setRating(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl border border-[#DDD0FA] bg-[#F1EBFF] p-6">
        <h3 className="text-xl font-bold text-[#1B1340]">Thank you for your review.</h3>
        <p className="mt-2 text-[15px] text-[#5C5878]">We read every review before it appears on the site.</p>
      </div>
    );
  }

  const shown = hover || rating;
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <fieldset>
        <legend className="mb-1 text-sm font-semibold">Your rating</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              className="rounded p-0.5 text-[#F2A81D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7C3AED]"
            >
              <Star className={`h-7 w-7 ${n <= shown ? "fill-current" : ""}`} aria-hidden="true" />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rv-name" className="mb-1 block text-sm font-semibold">
            Name
          </label>
          <input id="rv-name" name="name" autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="rv-role" className="mb-1 block text-sm font-semibold">
            Role and company <span className="font-normal text-[#5C5878]">(optional)</span>
          </label>
          <input id="rv-role" name="role" placeholder="Founder, Acme" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="rv-quote" className="mb-1 block text-sm font-semibold">
          Your review
        </label>
        <textarea id="rv-quote" name="quote" rows={4} placeholder="What did you work with us on, and how did it go?" className={field} />
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <label htmlFor="rv-website">Leave this field empty</label>
        <input id="rv-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "sending"} className="zq-btn zq-btn-indigo h-11 px-6 text-[15px]">
          {status === "sending" ? "Sending…" : "Submit review"}
        </Button>
        <p className="text-sm text-[#5C5878]">Reviews are checked before they are published.</p>
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
    </form>
  );
}
