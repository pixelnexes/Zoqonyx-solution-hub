"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { RESOURCES } from "@/lib/content-resources";

export default function AdminServicesPage() {
  return <ResourceManager def={RESOURCES.services} />;
}
