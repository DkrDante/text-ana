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

export const getQualitativeAnalysis = async (inputText, { isSassy, isRelationship }) => {
  const personaInstruction = isSassy ? "Adopt a strong, sassy, and caring persona." : "Adopt a direct, insightful, and neutral tone.";
  const contextInstruction = isRelationship ? "The user is in an established relationship." : "The user is NOT in an established relationship.";

  const prompt = `You are an insightful, rational friend analyzing a text message conversation. Your task is to understand the text's nuances, psychology, and underlying intent.

**Analysis Process:**
1.  **Write Explanation:** Provide a deep, rational analysis of the conversation. Call out manipulation, contradictions, or 'bullshit' when you see it.
2.  **Extract Flags:** Identify up to 2 "red flag" quotes (problematic communication) and up to 2 "green flag" quotes (positive communication) from the text. For each, explain why you flagged it.
3.  **Write Summary for Scorer:** Create a concise, private summary of your findings for another AI. This summary is CRITICAL and must accurately reflect your main explanation. Example: "The sender wrote a very long, high-effort apology, but it's full of blame-shifting and guilt-tripping, indicating high manipulation and conflict."

**Persona & Context:**
- **Persona:** ${personaInstruction}
- **Context:** ${contextInstruction}

Analyze the following conversation and respond ONLY with a valid JSON object.

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
          summary_for_scorer: { type: "STRING" },
          red_flags: { type: "ARRAY", items: { type: "OBJECT", properties: { quote: { type: "STRING" }, explanation: { type: "STRING" } } } },
          green_flags: { type: "ARRAY", items: { type: "OBJECT", properties: { quote: { type: "STRING" }, explanation: { type: "STRING" } } } }
        },
        required: ["status", "explanation", "summary_for_scorer", "red_flags", "green_flags"]
      }
    }
  };
  return callGemini(payload);
};

export const getQuantitativeScores = async (summary) => {
  const prompt = `You are a logical scoring machine. Your only task is to read a summary of a conversation analysis and assign four numerical scores based on the strict rubric below.

**Scoring Rubric:**
- **effort_score:** High (70-100) for long, detailed messages showing significant work. Low (0-30) for short, dismissive answers.
- **conflict_score:** High (70-100) for insults, threats, blame-shifting, or severe manipulation mentioned in the summary. Medium (40-69) for passive-aggression or frustration. Low (0-30) for calm, respectful language.
- **commitment_score:** High (70-100) for concrete future plans. Low (0-30) for vague, non-committal language.
- **romantic_score:** High (70-100) for clear romantic language. Low (0-30) for platonic language.

Based on the following summary, provide the four scores.

**Analysis Summary:**
"${summary}"`;
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          romantic_score: { type: "NUMBER" },
          commitment_score: { type: "NUMBER" },
          conflict_score: { type: "NUMBER" },
          effort_score: { type: "NUMBER" }
        },
        required: ["romantic_score", "commitment_score", "conflict_score", "effort_score"]
      }
    }
  };
  return callGemini(payload);
};

export const getReplySuggestions = async (text, analysis, { isSassy, isRelationship }) => {
  const personaInstruction = isSassy ? "Adopt a strong, sassy, and caring persona." : "Adopt a direct, insightful, and neutral tone.";
  const contextInstruction = isRelationship ? "The user is in an established relationship." : "The user is NOT in an established relationship.";

  const prompt = `You are a witty and insightful friend helping a user craft a reply.

**CRITICAL INSTRUCTIONS:**
1.  You MUST provide exactly one 'Spicy', one 'Casual', and one 'Honest' reply. The final 'replies' array must have exactly 3 items.
2.  The 'text' field for each reply MUST NOT be empty. It must contain a valid, suggested reply.
3.  Do not provide duplicate types.

**Persona:** ${personaInstruction}
**Context:** ${contextInstruction}
**Original Conversation:** \`\`\`${text}\`\`\`
**Your Previous Analysis:**
- Status: "${analysis.status}"
- Your Take: "${analysis.explanation}"

Based on all this, give three distinct reply suggestions.

**Reply Instructions & Examples:**
1.  **Spicy:** BOLD, DARING, and high-risk. A 'mic-drop' moment that seizes control.
    * *Example (if manipulative):* "I'm not interested in an apology that comes with a user manual on how I'm supposed to feel. Try again when you're ready to take full accountability."
2.  **Casual:** Safe, cool, and low-pressure. Defers the conversation.
    * *Example:* "Got your message. That's a lot to take in, I'll get back to you when I've had a chance to think."
3.  **Honest:** Direct and vulnerable, using "I" statements to set a clear boundary.
    * *Example:* "I appreciate you writing all that out. I'm still processing the hurt from what happened, and I need some space before I can talk about fixing things."

For each suggestion, you MUST provide a 'rationale' explaining the strategy. Respond ONLY with a valid JSON object.`;
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { replies: { type: "ARRAY", items: { type: "OBJECT", properties: { type: { type: "STRING", enum: ["Spicy", "Casual", "Honest"] }, text: { type: "STRING" }, rationale: { type: "STRING" } } } } } } }
  };
  return callGemini(payload);
}
