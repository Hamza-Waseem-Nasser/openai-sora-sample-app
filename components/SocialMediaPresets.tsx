"use client";

import { Monitor, Smartphone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOCIAL_MEDIA_PRESETS } from "@/utils/video";

interface SocialMediaPresetsProps {
  onSelectPreset: (size: string, label: string, presetKey: string) => void;
  currentSize: string;
  selectedPresetKey?: string;
}

export default function SocialMediaPresets({ onSelectPreset, selectedPresetKey }: SocialMediaPresetsProps) {
  const presets = Object.entries(SOCIAL_MEDIA_PRESETS);

  return (
    <div className="rounded-xl border border-border/60 bg-card/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Video className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Social Media Presets</h3>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Quick select optimal dimensions for popular platforms
      </p>
      <div className="grid grid-cols-3 gap-2">
        {presets.map(([key, { size, label }]) => {
          // Only highlight if this exact preset was selected
          const isSelected = selectedPresetKey === key;
          const isVertical = size.includes("x1280") || size.includes("x1920");
          const isSquare = size.includes("1080x1080");
          
          return (
            <Button
              key={key}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectPreset(size, label, key)}
              className={`flex h-auto flex-col items-center gap-1.5 px-3 py-2.5 transition-all ${
                isSelected 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-background/50 hover:bg-muted/60 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-center">
                {isVertical ? (
                  <Smartphone className="h-4 w-4" />
                ) : isSquare ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded border-2 border-current" />
                ) : (
                  <Monitor className="h-4 w-4" />
                )}
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs font-semibold leading-tight">{key}</span>
                <span className="text-[10px] opacity-70 font-mono">{size}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
