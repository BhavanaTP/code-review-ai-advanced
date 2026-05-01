"use client";

import { Sparkles, Play } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

interface TopBarProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function TopBar({ onAnalyze, isAnalyzing }: TopBarProps) {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground">
          Code Analysis
        </h1>

        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
          main.tsx
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* 🔐 AUTH SECTION */}
        {session ? (
          <div className="flex items-center gap-3 bg-muted px-3 py-1.5 rounded-lg border border-border shadow-sm">
            <img
              src={session.user?.image || ""}
              alt="user"
              className="h-7 w-7 rounded-full ring-2 ring-primary/40"
            />

            <span className="text-sm font-medium text-foreground">
              {session.user?.name}
            </span>

            <button
              onClick={() => signOut()}
              className="text-xs px-2 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("github")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 hover:shadow-lg text-white"
          >
            🚀 Login with GitHub
          </button>
        )}

        {/* 🚀 ANALYZE BUTTON */}
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !session}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200
            ${
              isAnalyzing
                ? "bg-purple-500/70 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 hover:shadow-lg"
            }
            text-white`}
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Analyze Code
            </>
          )}
        </button>

      </div>
    </header>
  );
}