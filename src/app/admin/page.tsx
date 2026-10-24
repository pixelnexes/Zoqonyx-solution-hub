import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Wrench,
  CheckCircle2,
  Clock,
  Activity,
  Mail,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToolIcon } from "@/components/common/tool-icon";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [totalTools, activeTools, comingSoonTools, totalUsage, messagesCount, subscribersCount, recentTools] =
    await Promise.all([
      prisma.tool.count(),
      prisma.tool.count({ where: { isActive: true, isComingSoon: false } }),
      prisma.tool.count({ where: { isComingSoon: true } }),
      prisma.tool.aggregate({ _sum: { usageCount: true } }),
      prisma.contactMessage.count(),
      prisma.notificationSubscriber.count(),
      prisma.tool.findMany({
        take: 8,
        orderBy: [{ updatedAt: "desc" }],
      }),
    ]);

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-foreground">
            Platform Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Welcome back, <span className="font-semibold text-foreground">{session.username}</span>. Here is your system status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/tools">
            <Button variant="gradient" size="sm" className="gap-1.5 shadow-sm">
              <Wrench className="w-3.5 h-3.5" />
              <span>Manage Tools</span>
            </Button>
          </Link>
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm">
              Live Site →
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Total Catalog</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-foreground">{totalTools}</p>
          <p className="text-xs text-muted-foreground">{activeTools} active, {comingSoonTools} coming soon</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Live Free Tools</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-emerald-500">{activeTools}</p>
          <p className="text-xs text-muted-foreground">100% operational in client browser</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Coming Soon Tools</span>
            <div className="p-2 rounded-lg bg-brand-purple/10 text-brand-purple">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-brand-purple">{comingSoonTools}</p>
          <p className="text-xs text-muted-foreground">{subscribersCount} subscribers notified on release</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Contact Messages</span>
            <div className="p-2 rounded-lg bg-brand-cyan/10 text-brand-cyan">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-brand-cyan">{messagesCount}</p>
          <p className="text-xs text-muted-foreground">Inquiries from users and partners</p>
        </div>
      </div>

      {/* Tools Table Preview */}
      <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">Recently Updated Tools</h3>
            <p className="text-xs text-muted-foreground">Control live status, coming soon state, and SEO properties.</p>
          </div>
          <Link href="/admin/tools" className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1">
            <span>Open Tools Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
              <tr>
                <th className="pb-3 font-semibold">Tool</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Usage</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {recentTools.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted/60">
                        <ToolIcon name={t.icon} className="w-4 h-4 text-brand-cyan" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">/tools/{t.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-xs text-muted-foreground">{t.category}</td>
                  <td className="py-3.5">
                    {t.isComingSoon ? (
                      <Badge variant="comingSoon" className="text-[10px]">Coming Soon</Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px]">Live Free</Badge>
                    )}
                  </td>
                  <td className="py-3.5 text-xs font-mono text-muted-foreground">
                    {t.usageCount.toLocaleString()} uses
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/tools/${t.slug}`}
                      target="_blank"
                      className="text-xs text-brand-cyan hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
