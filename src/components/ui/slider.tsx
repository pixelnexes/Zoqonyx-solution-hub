"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className,
  disabled = false,
}: SliderProps) {
  const currentVal = value[0] ?? min;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    if (onValueChange) {
      onValueChange([newVal]);
    }
  };

  const percentage = Math.min(100, Math.max(0, ((currentVal - min) / (max - min)) * 100));

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center py-2", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentVal}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-teal-500 focus:outline-none"
      />
    </div>
  );
}
