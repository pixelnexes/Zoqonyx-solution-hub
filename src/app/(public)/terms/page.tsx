import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms of Service | Zoqonyx Solution Hub",
  description: "Read the Terms of Service governing usage of Zoqonyx Solution Hub tools and services.",
};

export default async function TermsPage() {
  let page = null;
  try {
    page = await prisma.page.findUnique({
      where: { slug: "terms" },
    });
  } catch (e) {
    console.error("Error fetching terms page:", e);
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="space-y-8 bg-card border border-border/80 p-6 sm:p-10 rounded-2xl">
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-foreground">
          {page?.title || "Terms of Service"}
        </h1>

        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground space-y-4 leading-relaxed">
          {page?.content ? (
            page.content.split("\n\n").map((paragraph, idx) => {
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-xl font-heading font-bold text-foreground pt-4">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("#### ")) {
                return (
                  <h4 key={idx} className="text-lg font-heading font-semibold text-foreground pt-3">
                    {paragraph.replace("#### ", "")}
                  </h4>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })
          ) : (
            <p>Terms of service for Zoqonyx.</p>
          )}
        </div>
      </div>
    </div>
  );
}
