"use client";

import * as React from "react";
import { SiteSettings, defaultSettings } from "@/lib/settings";

interface SiteSettingsContextType {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = React.createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  refreshSettings: async () => {},
});

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: SiteSettings;
}) {
  const [settings, setSettings] = React.useState<SiteSettings>(
    initialSettings || defaultSettings
  );

  const refreshSettings = React.useCallback(async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error("Error refreshing site settings:", e);
    }
  }, []);

  // Sync if initialSettings changes from server navigation
  React.useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return React.useContext(SiteSettingsContext);
}
