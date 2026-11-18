"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { RESOURCES } from "@/lib/content-resources";

export default function AdminTestimonialsPage() {
  return <ResourceManager def={RESOURCES.testimonials} />;
}
