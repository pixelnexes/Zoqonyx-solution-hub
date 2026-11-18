"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { RESOURCES } from "@/lib/content-resources";

export default function AdminBlogPage() {
  return <ResourceManager def={RESOURCES.blog} />;
}
