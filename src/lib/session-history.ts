"use client";

export interface SessionHistoryItem {
  id: string;
  toolSlug: string;
  toolName: string;
  timestamp: number;
  action: string;
  summary: string;
  dataUrl?: string;
  fileName?: string;
}

const STORAGE_KEY = "zoqonyx_session_history_v1";

export function getSessionHistory(): SessionHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse session history", e);
    return [];
  }
}

export function addSessionHistory(item: Omit<SessionHistoryItem, "id" | "timestamp">): SessionHistoryItem {
  if (typeof window === "undefined") {
    return { ...item, id: "", timestamp: Date.now() };
  }
  try {
    const history = getSessionHistory();
    const newItem: SessionHistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      timestamp: Date.now(),
    };
    const updated = [newItem, ...history].slice(0, 50);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("zoqonyx_history_update"));
    return newItem;
  } catch (e) {
    console.error("Failed to add session history", e);
    return { ...item, id: "", timestamp: Date.now() };
  }
}

export function clearSessionHistory(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("zoqonyx_history_update"));
  } catch (e) {
    console.error("Failed to clear session history", e);
  }
}
