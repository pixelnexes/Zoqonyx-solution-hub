import { prisma } from "./prisma";

export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  contact_email_primary: string;
  contact_email_secondary: string;
  footer_credit: string;
  footer_url: string;
  logo_path: string;
  icon_path: string;
  primary_color: string;
  secondary_color: string;
  electric_cyan: string;
  soft_purple: string;
  default_theme: string;
}

export const defaultSettings: SiteSettings = {
  site_name: "ZOQONYX Solution Hub",
  site_tagline: "Free Online Tools Platform",
  contact_email_primary: "hello@zoqonyx.com",
  contact_email_secondary: "zawwar.ahmed2006@gmail.com",
  footer_credit: "Developed by Newix Tech Solutions",
  footer_url: "https://newixtechsolutions.com/",
  logo_path: "/logo/zoqonyx-logo.png",
  icon_path: "/logo/zoqonyx-icon.png",
  primary_color: "#1E3A8A",
  secondary_color: "#2563EB",
  electric_cyan: "#06B6D4",
  soft_purple: "#7C3AED",
  default_theme: "system",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return {
      ...defaultSettings,
      ...map,
    };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return defaultSettings;
  }
}
