import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ToolsManagerClient } from "./tools-manager-client";

export const dynamic = "force-dynamic";

export default async function AdminToolsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const tools = await prisma.tool.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-foreground">
          Tools Manager
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Enable or disable tools, switch between Live and Coming Soon states, edit SEO content, and adjust display priorities.
        </p>
      </div>

      <ToolsManagerClient initialTools={tools} />
    </div>
  );
}
