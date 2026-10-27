import React from "react";
import * as Icons from "lucide-react";
import { Wrench } from "lucide-react";

interface ToolIconProps {
  name?: string | null;
  className?: string;
  strokeWidth?: number;
}

export function ToolIcon({ name, className = "w-5 h-5", strokeWidth = 2.25 }: ToolIconProps) {
  if (!name) {
    return <Wrench className={className} strokeWidth={strokeWidth} />;
  }

  // Look up icon from lucide-react
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>)[name];

  if (!IconComponent) {
    return <Wrench className={className} strokeWidth={strokeWidth} />;
  }

  return <IconComponent className={className} strokeWidth={strokeWidth} />;
}
