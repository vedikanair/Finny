const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function parseTranscript(transcript, categories = []) {
  const categoryNames =
    categories.map((c) => c.name).join(", ") ||
    "Food, Transport, Shopping, Entertainment, Health, Other";

  const prompt = `You are a financial transaction parser for an Indian personal budget app.

Parse this voice transcript into a structured transaction. The user speaks Indian English and amounts may be in words or numbers.

Transcript: "${transcript}"

Available categories: ${categoryNames}

Rules:
- amount must be a positive number in INR
- type is either "expense" or "income"
- Pick the closest matching category from the available list
- note should be a short description (max 5 words)
- date is today: ${new Date().toISOString().split("T")[0]}
- If amount is unclear return confidence: "low"

Respond ONLY with valid JSON, no explanation:
{"amount":0,"type":"expense","category":"","note":"","date":"","confidence":"high"}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 },
      }),
    },
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return null;
  }
}
