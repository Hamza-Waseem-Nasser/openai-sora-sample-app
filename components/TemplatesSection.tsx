"use client";

import { useState } from "react";
import { Sparkles, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MARKETING_CATEGORIES,
  MARKETING_TEMPLATES,
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

  const visibleTemplates = isExpanded ? displayTemplates : displayTemplates.slice(0, 3);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border/60 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Marketing Templates</h3>
              <p className="text-xs text-muted-foreground">
                Pre-built prompts for common use cases
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2">
            {MARKETING_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
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
        <div className="space-y-2">
          {visibleTemplates.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No templates found matching "{searchQuery}"
            </div>
          ) : (
            visibleTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="w-full rounded-lg border border-border bg-background p-3 text-left transition-all hover:border-primary/50 hover:bg-accent hover:shadow-sm"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    {template.title}
                  </h4>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {template.category}
                  </span>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5">
                    {template.suggestedModel}
                  </span>
                  <span className="rounded bg-muted px-1.5 py-0.5">
                    {template.suggestedSize}
                  </span>
                  <span className="rounded bg-muted px-1.5 py-0.5">
                    {template.suggestedSeconds}s
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Show More/Less */}
        {displayTemplates.length > 3 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full"
          >
            {isExpanded
              ? "Show Less"
              : `Show ${displayTemplates.length - 3} More Templates`}
          </Button>
        )}

        <p className="text-center text-xs text-muted-foreground">
          {MARKETING_TEMPLATES.length} templates available
        </p>
      </div>
    </div>
  );
}
