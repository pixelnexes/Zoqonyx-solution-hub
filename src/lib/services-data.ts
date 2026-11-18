import type { ServiceSeed } from "@/lib/services-types";
import { GAME_APP_SERVICES } from "@/lib/services-data-games-apps";
import { WEB_MARKETING_SERVICES } from "@/lib/services-data-web-marketing";
import { AI_NFT_STAFF_ERP_SERVICES } from "@/lib/services-data-ai-nft-staff-erp";

export type { ServiceSeed, ServiceFaq, ServiceStep } from "@/lib/services-types";

export const SERVICE_SEEDS: ServiceSeed[] = [
  ...GAME_APP_SERVICES,
  ...WEB_MARKETING_SERVICES,
  ...AI_NFT_STAFF_ERP_SERVICES,
];

/** Group hubs in the order they appear on the Services page. */
export const SERVICE_GROUP_ORDER = [
  "game-development",
  "app-development",
  "website-development",
  "custom-software",
  "digital-marketing",
  "ai-nlp-development",
  "nft-development",
  "staff-augmentation",
  "erp-crm-development",
];
