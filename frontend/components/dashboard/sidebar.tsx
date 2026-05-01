"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  History as HistoryIcon,
  Settings,
  Code2,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

/* 👇 TYPE */
type HistoryItem = {
  code: string;
  score: number;
  date: string;
};

export function DashboardSidebar({
  history = [],
  onSelectHistory,
}: {
  history?: HistoryItem[];
  onSelectHistory?: (item: HistoryItem) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Code2 className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-foreground">
            CodeReview AI
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2">

        {/* Dashboard */}
        <button
          onClick={() => setActiveTab("Dashboard")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
            activeTab === "Dashboard"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          {!collapsed && "Dashboard"}
        </button>

        {/* History */}
        <button
          onClick={() => setActiveTab("History")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
            activeTab === "History"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <HistoryIcon className="h-4 w-4" />
          {!collapsed && "History"}
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab("Settings")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
            activeTab === "Settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && "Settings"}
        </button>

        {/* 🔥 HISTORY PANEL */}
        {activeTab === "History" && !collapsed && (
          <div className="mt-3 space-y-2">
            {history.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No history yet
              </p>
            )}

            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => onSelectHistory?.(item)}
                className="cursor-pointer rounded-lg bg-sidebar-accent/40 p-2 text-xs hover:bg-sidebar-accent"
              >
                <div className="font-medium">
                  Score: {item.score}
                </div>
                <div className="text-muted-foreground">
                  {item.date}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 SETTINGS PANEL */}
        {activeTab === "Settings" && !collapsed && (
          <div className="mt-3 text-xs text-muted-foreground">
            Settings panel (UI controlled from main page)
          </div>
        )}
      </nav>

      {/* Collapse */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 hover:bg-sidebar-accent"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>
    </aside>
  );
}