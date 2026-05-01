"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreCardProps {
  score: number;
  previousScore?: number;
  isAnalyzing: boolean;
}

export function ScoreCard({ score, previousScore, isAnalyzing }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-success/20 to-success/5";
    if (score >= 60) return "from-warning/20 to-warning/5";
    return "from-destructive/20 to-destructive/5";
  };

  const scoreDiff = previousScore ? score - previousScore : 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-gradient-to-br p-4",
        getScoreGradient(score)
      )}
    >
      {isAnalyzing ? (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-full bg-secondary" />
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
            <div className="h-3 w-32 animate-pulse rounded bg-secondary" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Score circle */}
          <div className="relative flex h-14 w-14 items-center justify-center">
            <svg className="absolute h-full w-full -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-secondary"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={150.8}
                strokeDashoffset={150.8 - (150.8 * score) / 100}
                strokeLinecap="round"
                className={getScoreColor(score)}
              />
            </svg>
            <span className={cn("text-lg font-bold", getScoreColor(score))}>
              {score}
            </span>
          </div>

          {/* Score details */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Code Score</h3>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              {scoreDiff > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-success">+{scoreDiff} from last</span>
                </>
              ) : scoreDiff < 0 ? (
                <>
                  <TrendingDown className="h-3 w-3 text-destructive" />
                  <span className="text-destructive">{scoreDiff} from last</span>
                </>
              ) : (
                <>
                  <Minus className="h-3 w-3" />
                  <span>No change</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
