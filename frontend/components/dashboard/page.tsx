"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">

      <h1 className="text-4xl font-bold mb-4">
        CodeReview AI 🚀
      </h1>

      <p className="text-muted-foreground mb-8 text-center max-w-md">
        AI-powered code review with smart suggestions.
      </p>

      <div className="flex gap-4">

        <Link
          href="/dashboard"
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow hover:scale-105 transition"
        >
          Open Dashboard
        </Link>

        {!session && (
          <button
            onClick={() => signIn("github")}
            className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition"
          >
            Login with GitHub
          </button>
        )}

      </div>
    </div>
  );
}