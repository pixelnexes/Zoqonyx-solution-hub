import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Zoqonyx Solution Hub",
  description: "Read the Zoqonyx Solution Hub privacy policy. Learn why client-side processing guarantees your private data remains completely confidential.",
};

export default async function PrivacyPolicyPage() {
  const page = await prisma.page.findUnique({
    where: { slug: "privacy-policy" },
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="space-y-8 bg-card border border-border/80 p-6 sm:p-10 rounded-2xl">
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-foreground">
          {page?.title || "Privacy Policy"}
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
            <p>Your privacy is important to us.</p>
          )}
        </div>
      </div>
    </div>
  );
}
