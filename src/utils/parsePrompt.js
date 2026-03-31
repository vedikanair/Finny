export function buildParsePrompt(transcript, categories, todayDate) {
  const categoryNames = categories.length
    ? categories.map((c) => c.name).join(", ")
    : "Food, Transport, Shopping, Entertainment, Health, Other";

  return `You are a financial transaction parser for an Indian personal budget app.

Parse this voice transcript into a structured transaction. The user speaks Indian English — amounts may be words like "five hundred", "ek sau pachas", or numbers like "500".

Transcript: "${transcript}"
Available categories: ${categoryNames}
Today's date: ${todayDate}

Rules:
- amount: positive number in INR (no currency symbol)
- type: "expense" or "income"
- category: must match one from the available list exactly
- note: max 5 words describing the transaction
- date: use today's date unless user specifies otherwise
- confidence: "high" if amount and type are clear, "low" if ambiguous

Return ONLY valid JSON:
{"amount":0,"type":"expense","category":"","note":"","date":"","confidence":"high"}`;
}
