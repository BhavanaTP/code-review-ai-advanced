import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, language } = req.body;

  const prompt = `
You are an expert code reviewer.

Return STRICT JSON:
{
  "score": number,
  "summary": "short summary",
  "issues": [
    { "line": number, "issue": "...", "fix": "..." }
  ]
}

Code (${language}):
${code}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { score: 5, summary: text, issues: [] };
    }

    res.json(parsed);

  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
});

export default router;