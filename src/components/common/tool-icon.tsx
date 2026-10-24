import React from "react";
import * as Icons from "lucide-react";
import { Wrench } from "lucide-react";

interface ToolIconProps {
  name?: string | null;
  className?: string;
}

export function ToolIcon({ name, className = "w-5 h-5 text-brand-cyan" }: ToolIconProps) {
  if (!name) {
    return <Wrench className={className} />;
  }

  // Look up icon from lucide-react
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];

  if (!IconComponent) {
    return <Wrench className={className} />;
  }

  return <IconComponent className={className} />;
}
