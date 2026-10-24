import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Mail, Calendar, User, Trash2, Bell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [messages, subscribers] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.notificationSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-foreground">
          Inquiries & Notifications
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Review incoming contact form submissions and early-access subscribers for upcoming tools.
        </p>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
          <Mail className="w-5 h-5 text-brand-cyan" />
          <span>Contact Form Messages ({messages.length})</span>
        </h3>

        {messages.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-card border border-border/80 text-xs text-muted-foreground">
            No contact messages received yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-5 rounded-2xl bg-card border border-border/80 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                      <User className="w-4 h-4 text-brand-cyan" />
                      <span>{msg.name}</span>
                    </p>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-brand-accent dark:text-brand-cyan hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>

                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(msg.createdAt)}</span>
                  </span>
                </div>

                <p className="p-3 rounded-xl bg-muted/30 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subscribers List */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-purple" />
          <span>Coming Soon Subscribers ({subscribers.length})</span>
        </h3>

        {subscribers.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-card border border-border/80 text-xs text-muted-foreground">
            No early-access notification requests logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b border-border/60 bg-muted/20">
                <tr>
                  <th className="p-3.5 font-semibold">Subscriber Email</th>
                  <th className="p-3.5 font-semibold">Tool Slug</th>
                  <th className="p-3.5 font-semibold">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30">
                    <td className="p-3.5 font-medium text-foreground">{sub.email}</td>
                    <td className="p-3.5 font-mono text-xs text-brand-purple">/tools/{sub.toolSlug}</td>
                    <td className="p-3.5 text-xs text-muted-foreground">{formatDate(sub.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
