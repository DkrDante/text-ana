
const callGemini = async (payload) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`API error: ${response.statusText}`);
  const result = await response.json();
  if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
    return JSON.parse(result.candidates[0].content.parts[0].text);
  }
  throw new Error("The AI returned an unexpected response.");
};

export const getAiAnalysis = async (inputText, { isSassy, isRelationship }) => {
  const personaInstruction = isSassy
    ? "Adopt a strong, sassy, and caring persona. Feel free to use familiar language like 'honey' or 'darling'."
    : "Adopt a direct, insightful, and neutral tone. Avoid overly familiar or sassy language.";

  const contextInstruction = isRelationship
    ? "The user has indicated they are in an established relationship."
    : "The user has indicated this is NOT an established relationship (e.g., dating, situationship, etc.).";

  const prompt = `You are an insightful, rational friend analyzing a text message conversation.

**PRIMARY DIRECTIVE: RATIONAL ANALYSIS**
Your single most important task is to identify the TRUE underlying intent of the message. Dig deep, analyze the psychology, and call out manipulative or contradictory language.

**Analysis Framework:**
1.  **Identify Primary Intent:** What is the sender's main goal? Choose ONE from this list: ["Genuine Apology", "Manipulation", "High-Conflict", "Affection", "Seeking Connection", "Low-Effort Dismissal"].
2.  **Rate Intensity:** On a scale of 1-10, how strongly is this intent being conveyed?
3.  **Write Explanation:** Based on your analysis, write a textual explanation. Do not mention the scores or intent directly.
4.  **Create Status:** Write a short, punchy status title.

**Persona & Context Instructions:**
- **Persona:** ${personaInstruction}
- **Context:** ${contextInstruction}

Analyze the following conversation and respond ONLY with a valid JSON object that conforms to the provided schema.

Conversation:
\`\`\`
${inputText}
\`\`\``;
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          status: { type: "STRING" },
          explanation: { type: "STRING" },
          primary_intent: { type: "STRING", enum: ["Genuine Apology", "Manipulation", "High-Conflict", "Affection", "Seeking Connection", "Low-Effort Dismissal"] },
          intensity: { type: "NUMBER", description: "A score from 1-10 for the intent's strength." }
        },
        required: ["status", "explanation", "primary_intent", "intensity"]
      }
    }
  };
  return callGemini(payload);
};

export const getReplySuggestions = async (text, analysis, { isRelationship }) => {
  const contextInstruction = isRelationship
    ? "The user is in an established relationship."
    : "The user is NOT in an established relationship.";

  const prompt = `You are a witty and insightful friend helping a user craft a reply to a text message.

**Context:**
${contextInstruction}

**Original Conversation:**
\`\`\`
${text}
\`\`\`

**Your Previous Analysis:**
- Status: "${analysis.status}"
- Your Take: "${analysis.explanation}"

Based on all this, give three reply suggestions.

**Reply Instructions:**
1.  **Spicy:** Make this reply BOLD, DARING, and high-risk. It should be a 'mic-drop' moment that escalates the situation to make a powerful point. Think "damn, whattt" level of impact.
2.  **Casual:** Make this reply safe, cool, and low-pressure.
3.  **Honest:** Make this reply direct, vulnerable, and clear about feelings or boundaries.

Respond ONLY with a valid JSON object that conforms to the provided schema.`;
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { replies: { type: "ARRAY", items: { type: "OBJECT", properties: { type: { type: "STRING", enum: ["Spicy", "Casual", "Honest"] }, text: { type: "STRING" } } } } } } }
  };
  return callGemini(payload);
}
