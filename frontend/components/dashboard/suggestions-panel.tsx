"use client";

import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

export interface Suggestion {
  id: string;
  type: "error" | "warning" | "suggestion" | "info";
  title: string;
  description: string;
  line: number;
}

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
  isAnalyzing: boolean;
}

const typeConfig = {
  error: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
  },
  suggestion: {
    icon: Lightbulb,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    border: "border-chart-2/20",
  },
  info: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
  },
};

export function SuggestionsPanel({
  suggestions,
  isAnalyzing,
}: SuggestionsPanelProps) {
  const errorCount = suggestions.filter((s) => s.type === "error").length;
  const warningCount = suggestions.filter((s) => s.type === "warning").length;
  const suggestionCount = suggestions.filter(
    (s) => s.type === "suggestion"
  ).length;

  return (
    <div className="flex h-full w-80 flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="text-sm font-semibold text-foreground">AI Suggestions</h2>
        <div className="mt-2 flex gap-3 text-xs">
          <span className="flex items-center gap-1 text-destructive">
            <AlertCircle className="h-3 w-3" />
            {errorCount}
          </span>
          <span className="flex items-center gap-1 text-warning">
            <AlertTriangle className="h-3 w-3" />
            {warningCount}
          </span>
          <span className="flex items-center gap-1 text-chart-2">
            <Lightbulb className="h-3 w-3" />
            {suggestionCount}
          </span>
        </div>
      </div>

      {/* Suggestions list */}
      <div className="flex-1 overflow-y-auto p-3">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-sm text-muted-foreground">
              Analyzing your code...
            </p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-success/50" />
            <p className="mt-3 text-sm font-medium text-foreground">
              No issues found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your code looks great!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {suggestions.map((suggestion) => {
              const config = typeConfig[suggestion.type];
              const Icon = config.icon;

              return (
                <div
                  key={suggestion.id}
                  className={cn(
                    "cursor-pointer rounded-lg border p-3 transition-colors hover:bg-secondary/50",
                    config.bg,
                    config.border
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground truncate">
                          {suggestion.title}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          Line {suggestion.line}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
