"use client";

import { FileCode, Clock, Zap } from "lucide-react";

interface SummaryCardProps {
  linesOfCode: number;
  analysisTime: number;
  suggestionsCount: number;
  isAnalyzing: boolean;
}

export function SummaryCard({
  linesOfCode,
  analysisTime,
  suggestionsCount,
  isAnalyzing,
}: SummaryCardProps) {
  const stats = [
    {
      icon: FileCode,
      label: "Lines",
      value: linesOfCode,
    },
    {
      icon: Clock,
      label: "Time",
      value: `${analysisTime}s`,
    },
    {
      icon: Zap,
      label: "Issues",
      value: suggestionsCount,
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">Analysis Summary</h3>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-lg bg-secondary/50 p-3"
          >
            <stat.icon className="h-4 w-4 text-muted-foreground" />
            {isAnalyzing ? (
              <div className="mt-2 h-5 w-8 animate-pulse rounded bg-secondary" />
            ) : (
              <span className="mt-2 text-lg font-semibold text-foreground">
                {stat.value}
              </span>
            )}
            <span className="mt-0.5 text-xs text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
