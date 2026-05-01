"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

export type Issue = {
  id: string;
  line: number;
  title: string;
  description: string;
};

type Props = {
  value: string;
  onChange: (val?: string) => void;
  issues: Issue[];
  fixedCode?: string; // full fixed version from backend
};

export function CodeEditor({ value, onChange, issues, fixedCode }: Props) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [ghost, setGhost] = useState<string>("");

  /* =========================
     🔧 INIT
  ========================= */
  function handleMount(editor: any, monaco: any) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register inline completion (ghost text)
    monaco.languages.registerInlineCompletionsProvider("python", {
      provideInlineCompletions: async () => {
        if (!ghost) return { items: [], dispose: () => {} };

        return {
          items: [
            {
              insertText: ghost,
              range: undefined,
            },
          ],
          dispose: () => {},
        };
      },
    });
  }

  /* =========================
     🔥 INLINE ERROR MARKERS
  ========================= */
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const monaco = monacoRef.current;

    const markers = issues.map((i) => ({
      startLineNumber: i.line,
      endLineNumber: i.line,
      startColumn: 1,
      endColumn: 200,
      message: i.description,
      severity: monaco.MarkerSeverity.Warning,
    }));

    monaco.editor.setModelMarkers(
      editorRef.current.getModel(),
      "owner",
      markers
    );
  }, [issues]);

  /* =========================
     🔥 CLICK LINE → APPLY FIX
  ========================= */
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    const disposable = editor.onMouseDown((e: any) => {
      if (!e.target.position) return;

      const line = e.target.position.lineNumber;
      const issue = issues.find((i) => i.line === line);

      if (issue && fixedCode) {
        // replace full code with fixed version
        editor.setValue(fixedCode);
        setGhost("");
      }
    });

    return () => disposable.dispose();
  }, [issues, fixedCode]);

  /* =========================
     🤖 COPILOT-LIKE GHOST TEXT
  ========================= */
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!value || value.length < 5) {
        setGhost("");
        return;
      }

      try {
        // Call your backend (Gemini already integrated there)
        const res = await fetch("http://localhost:5000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: value }),
        });

        const data = await res.json();

        // Show delta as ghost suggestion (simple approach)
        if (data.fixedCode && data.fixedCode !== value) {
          const suggestion = data.fixedCode.replace(value, "");
          setGhost(suggestion);
        } else {
          setGhost("");
        }
      } catch {
        setGhost("");
      }
    }, 800); // debounce

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      theme="vs-dark"
      value={value}
      onChange={onChange}
      onMount={handleMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        smoothScrolling: true,
      }}
    />
  );
}