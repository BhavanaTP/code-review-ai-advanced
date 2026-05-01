"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSession, signIn } from "next-auth/react";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { CodeEditor } from "@/components/dashboard/code-editor";
import {
  SuggestionsPanel,
  Suggestion,
} from "@/components/dashboard/suggestions-panel";
import { ScoreCard } from "@/components/dashboard/score-card";
import { SummaryCard } from "@/components/dashboard/summary-card";

export type HistoryItem = {
  code: string;
  score: number;
  date: string;
};

export default function Dashboard() {
  const { data: session, status } = useSession();

  const [code, setCode] = useState(`def count_failed_friends(N, D):
    count = 0
    for i in range(1, N+1):
        if D[i] != D[i-1]:
            count += 1
    return count`);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState<number | undefined>();
  const [analysisTime, setAnalysisTime] = useState(0);
  const [fixedCode, setFixedCode] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showIntro, setShowIntro] = useState(true); // 🔥 NEW

  const userKey = useMemo(() => {
    if (status === "loading") return "history_loading";
    return session?.user?.email
      ? `history_${session.user.email}`
      : "history_guest";
  }, [session, status]);

  useEffect(() => {
    if (status === "loading") return;
    const saved = localStorage.getItem(userKey);
    if (saved) setHistory(JSON.parse(saved));
  }, [userKey, status]);

  useEffect(() => {
    if (status === "loading") return;
    localStorage.setItem(userKey, JSON.stringify(history));
  }, [history, userKey, status]);

  const handleAnalyze = useCallback(async () => {
    if (!session) {
      signIn("github");
      return;
    }

    setShowIntro(false); // 🔥 hide intro after first use
    setIsAnalyzing(true);
    setSuggestions([]);

    const start = performance.now();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      setPreviousScore(score || undefined);
      setScore(data.score || 0);
      setSuggestions(data.issues || []);
      setFixedCode(data.fixedCode || "");

      const newItem: HistoryItem = {
        code,
        score: data.score,
        date: new Date().toLocaleString(),
      };

      setHistory((prev) => [newItem, ...prev].slice(0, 10));

      const end = performance.now();
      setAnalysisTime(Number(((end - start) / 1000).toFixed(2)));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, score, session]);

  const handleApplyFix = () => {
    if (fixedCode) {
      setCode(fixedCode);
      setFixedCode("");
      setSuggestions([]);
    }
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setShowIntro(false); // 🔥 hide intro when history used
    setCode(item.code);
    setScore(item.score);
    setSuggestions([]);
  };

  const linesOfCode = code.split("\n").length;

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar
        history={history}
        onSelectHistory={handleLoadHistory}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">

            {/* 🔥 INTRO SECTION */}
            {showIntro && (
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <h2 className="text-xl font-semibold mb-2">
                  👋 Welcome to CodeReview AI
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Paste your code, click analyze, and get instant AI-powered
                  suggestions, bug detection, and improvements.
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports Python, JavaScript, and Java 🚀
                </p>
              </div>
            )}

            {!session && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg text-sm">
                ⚠️ Login required to analyze code and avoid pasting comments
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <ScoreCard
                score={score}
                previousScore={previousScore}
                isAnalyzing={isAnalyzing}
              />

              <SummaryCard
                linesOfCode={linesOfCode}
                analysisTime={analysisTime}
                suggestionsCount={suggestions.length}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {fixedCode && (
              <button
                onClick={handleApplyFix}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Apply Fix
              </button>
            )}

            <div className="flex-1 overflow-hidden">
              <CodeEditor
  value={code}
  onChange={(val) => setCode(val || "")}
  issues={suggestions}
  fixedCode={fixedCode}
/>
            </div>
          </div>

          <SuggestionsPanel
            suggestions={suggestions}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </div>
  );
}
