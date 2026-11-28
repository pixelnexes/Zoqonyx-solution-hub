import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LeadModal } from "@/components/site/lead-modal";
import { getServices } from "@/lib/content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const services = (await getServices())
    .filter((s) => !s.isHub || s.slug === "nft-development")
    .map((s) => ({ slug: s.slug, name: s.name }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <LeadModal services={services} />
    </div>
  );
}
