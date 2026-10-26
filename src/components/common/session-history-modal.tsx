"use client";

import * as React from "react";
import Link from "next/link";
import { History, Trash2, X, ExternalLink, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSessionHistory, clearSessionHistory, SessionHistoryItem } from "@/lib/session-history";

export function SessionHistoryModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [history, setHistory] = React.useState<SessionHistoryItem[]>([]);

  const loadHistory = React.useCallback(() => {
    setHistory(getSessionHistory());
  }, []);

  React.useEffect(() => {
    loadHistory();
    const handleUpdate = () => loadHistory();
    window.addEventListener("zoqonyx_history_update", handleUpdate);
    return () => window.removeEventListener("zoqonyx_history_update", handleUpdate);
  }, [loadHistory]);

  const handleClear = () => {
    clearSessionHistory();
    setHistory([]);
  };

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors border border-border/40"
        title="View session activity (cleared on tab close)"
      >
        <History className="w-3.5 h-3.5 text-teal-500" />
        <span className="hidden sm:inline">Session History</span>
        {history.length > 0 && (
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-400 border border-teal-500/20">
            {history.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500 border border-teal-500/20">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Session Activity</h3>
                  <p className="text-xs text-muted-foreground">Transient in-memory tab history</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Privacy notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-500/5 border border-teal-500/20 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <span>
                <strong>100% Private & Transient:</strong> This history exists only in your current tab. No data is ever sent to our servers. Closing this tab or window permanently wipes this record.
              </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[160px]">
              {history.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No activity in this tab yet</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    Use any tool to convert, compress, or generate content to see your timeline here.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/tools/${item.toolSlug}`}
                          onClick={() => setIsOpen(false)}
                          className="font-medium text-foreground hover:text-teal-400 inline-flex items-center gap-1 truncate"
                        >
                          {item.toolName}
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </Link>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-muted-foreground truncate">{item.summary}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {history.length > 0 && (
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{history.length} item(s) logged</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
