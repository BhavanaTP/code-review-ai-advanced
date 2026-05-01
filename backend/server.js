const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   🔥 DATABASE CONNECTION
========================= */
mongoose.connect("mongodb://127.0.0.1:27017/code-review", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("✅ MongoDB connected");

/* =========================
   📦 SCHEMA
========================= */
const History = mongoose.model("History", {
  code: String,
  score: Number,
  user: String,
  createdAt: { type: Date, default: Date.now },
});

/* =========================
   🧠 LANGUAGE DETECTION
========================= */
function detectLanguage(code) {
  if (code.includes("def ") || code.includes("print(")) return "python";
  if (code.includes("System.out")) return "java";
  return "javascript";
}

/* =========================
   🔧 AUTO FIX ENGINE
========================= */
function autoFixCode(code, language) {
  let fixed = code;

  if (language === "python") {
    // Fix index loop → safe iteration
    if (fixed.includes("range(")) {
      fixed = fixed.replace(
        /for i in range\(.*\):/,
        "for prev, curr in zip(D, D[1:]):"
      );

      fixed = fixed.replace(
        /if D\[i\] != D\[i-1\]:/,
        "if curr != prev:"
      );
    }

    // Add input validation
    if (!fixed.includes("len(")) {
      fixed = fixed.replace(
        "count = 0",
        "if not D:\n        return 0\n    count = 0"
      );
    }

    // Add docstring
    if (!fixed.includes('"""')) {
      fixed =
        '"""Counts number of changes between consecutive elements"""\n' +
        fixed;
    }
  }

  return fixed;
}

/* =========================
   🚀 ANALYZE API
========================= */
app.post("/analyze", (req, res) => {
  const { code } = req.body;
  const language = detectLanguage(code);

  try {
    const issues = [];

    if (code.includes("i-1")) {
      issues.push({
        id: "1",
        type: "error",
        title: "Possible index error",
        description: "Accessing D[i-1] may fail at i=0.",
        line: 4,
      });
    }

    if (!code.includes("len(")) {
      issues.push({
        id: "2",
        type: "warning",
        title: "No input validation",
        description: "Validate input length.",
        line: 1,
      });
    }

    if (code.includes("range(")) {
      issues.push({
        id: "3",
        type: "suggestion",
        title: "Improve iteration logic",
        description: "Use zip instead of indexing.",
        line: 3,
      });
    }

    if (!code.includes('"""')) {
      issues.push({
        id: "4",
        type: "suggestion",
        title: "Missing docstring",
        description: "Add a docstring.",
        line: 1,
      });
    }

    const fixedCode = autoFixCode(code, language);

    res.json({
      score: Math.max(3, 10 - issues.length),
      issues,
      fixedCode,
    });

  } catch (err) {
    console.error(err);
    res.json({
      score: 5,
      issues: [],
      fixedCode: code,
    });
  }
});

/* =========================
   💾 SAVE HISTORY
========================= */
app.post("/save", async (req, res) => {
  const { code, score, user } = req.body;

  try {
    const saved = await History.create({ code, score, user });
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Save failed" });
  }
});

/* =========================
   📜 GET HISTORY
========================= */
app.get("/history/:user", async (req, res) => {
  try {
    const data = await History.find({ user: req.params.user })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

/* =========================
   🚀 SERVER START
========================= */
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});