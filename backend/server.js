const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   ⚙️ MIDDLEWARE
========================= */
app.use(cors({
  origin: "*", // allow all (safe for now)
}));
app.use(express.json());

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
    // Improve loop
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

    // Add validation
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
   📦 TEMP MEMORY STORAGE
========================= */
let history = [];

/* =========================
   🚀 ANALYZE API
========================= */
app.post("/analyze", (req, res) => {
  const { code } = req.body;
  const language = detectLanguage(code);

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
});

/* =========================
   💾 SAVE HISTORY (TEMP)
========================= */
app.post("/save", (req, res) => {
  const { code, score, user } = req.body;

  const newItem = {
    code,
    score,
    user,
    date: new Date().toLocaleString(),
  };

  history.unshift(newItem);
  history = history.slice(0, 10); // keep latest 10

  res.json(newItem);
});

/* =========================
   📜 GET HISTORY (TEMP)
========================= */
app.get("/history/:user", (req, res) => {
  const userHistory = history.filter(
    (item) => item.user === req.params.user
  );

  res.json(userHistory);
});

/* =========================
   🚀 START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
