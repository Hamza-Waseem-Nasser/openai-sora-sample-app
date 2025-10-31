"use client";

import { useState } from "react";
import { Sparkles, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MARKETING_CATEGORIES,
  getTemplatesByCategory,
  searchTemplates,
  type MarketingTemplate,
  type MarketingCategory,
} from "@/utils/marketingTemplates";

interface TemplatesSectionProps {
  onSelectTemplate: (template: MarketingTemplate) => void;
}

export default function TemplatesSection({ onSelectTemplate }: TemplatesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<MarketingCategory>("All Templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const displayTemplates = searchQuery
    ? searchTemplates(searchQuery)
    : getTemplatesByCategory(selectedCategory);

  const visibleTemplates = isExpanded ? displayTemplates : displayTemplates.slice(0, 2);

  return (
    <div className="rounded-xl border border-border/60 bg-card/30 shadow-sm">
      <div className="border-b border-border/40 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-semibold">Marketing Templates</h3>
            <p className="text-[10px] text-muted-foreground">
              Pre-built prompts for common use cases
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 pr-8 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Categories */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-1.5">
            {MARKETING_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Templates Grid */}
        <div className="space-y-1.5">
          {visibleTemplates.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No templates found matching &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            visibleTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="w-full rounded-lg border border-border/60 bg-background/50 p-2.5 text-left transition-all hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-foreground leading-tight">
                    {template.title}
                  </h4>
                  <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                    {template.category}
                  </span>
                </div>
                <p className="mb-1.5 text-[10px] text-muted-foreground line-clamp-1">
                  {template.description}
                </p>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  <span className="rounded bg-muted px-1 py-0.5">
                    {template.suggestedModel}
                  </span>
                  <span className="rounded bg-muted px-1 py-0.5">
                    {template.suggestedSize}
                  </span>
                  <span className="rounded bg-muted px-1 py-0.5">
                    {template.suggestedSeconds}s
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Show More/Less */}
        {displayTemplates.length > 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full h-7 text-xs"
          >
            {isExpanded
              ? "Show Less"
              : `Show ${displayTemplates.length - 2} More`}
          </Button>
        )}
      </div>
    </div>
  );
}
