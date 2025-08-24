// Optimized API configuration
const API_CONFIG = {
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  headers: { 'Content-Type': 'application/json' }
};

// Cache configuration
const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes default
  maxSize: 100, // Maximum cache entries
  ttls: {
    qualitativeAnalysis: 10 * 60 * 1000, // 10 minutes for analysis
    quantitativeScores: 15 * 60 * 1000,  // 15 minutes for scores
    replySuggestions: 5 * 60 * 1000       // 5 minutes for suggestions
  }
};

// Enhanced cache implementation with TTL and size limits
class GeminiCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.accessOrder = [];
  }

  _cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    // Remove expired entries
    for (const [key, timestamp] of this.timestamps.entries()) {
      const ttl = this._getTTL(key);
      if (now - timestamp > ttl) {
        keysToDelete.push(key);
      }
    }

    // Remove oldest entries if cache is too large
    while (this.cache.size - keysToDelete.length > CACHE_CONFIG.maxSize && this.accessOrder.length > 0) {
      const oldestKey = this.accessOrder.shift();
      if (!keysToDelete.includes(oldestKey)) {
        keysToDelete.push(oldestKey);
      }
    }

    // Delete identified keys
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.timestamps.delete(key);
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
    });
  }

  _getTTL(key) {
    if (key.startsWith('qual_')) return CACHE_CONFIG.ttls.qualitativeAnalysis;
    if (key.startsWith('quant_')) return CACHE_CONFIG.ttls.quantitativeScores;
    if (key.startsWith('reply_')) return CACHE_CONFIG.ttls.replySuggestions;
    return CACHE_CONFIG.defaultTTL;
  }

  _generateKey(prefix, data) {
    // Create a deterministic hash of the input data
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < jsonStr.length; i++) {
      const char = jsonStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `${prefix}_${Math.abs(hash).toString(36)}`;
  }

  get(prefix, data) {
    this._cleanup();
    const key = this._generateKey(prefix, data);

    if (this.cache.has(key)) {
      const timestamp = this.timestamps.get(key);
      const ttl = this._getTTL(key);

      if (Date.now() - timestamp <= ttl) {
        // Move to end of access order (mark as recently used)
        const index = this.accessOrder.indexOf(key);
        if (index > -1) {
          this.accessOrder.splice(index, 1);
        }
        this.accessOrder.push(key);

        return this.cache.get(key);
      } else {
        // Expired entry
        this.cache.delete(key);
        this.timestamps.delete(key);
        const index = this.accessOrder.indexOf(key);
        if (index > -1) {
          this.accessOrder.splice(index, 1);
        }
      }
    }

    return null;
  }

  set(prefix, data, result) {
    this._cleanup();
    const key = this._generateKey(prefix, data);

    this.cache.set(key, result);
    this.timestamps.set(key, Date.now());
    this.accessOrder.push(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
    this.accessOrder = [];
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: CACHE_CONFIG.maxSize,
      ttls: CACHE_CONFIG.ttls
    };
  }
}

// Global cache instance
const geminiCache = new GeminiCache();

// Shared response schemas
const SCHEMAS = {
  qualitativeAnalysis: {
    type: "OBJECT",
    properties: {
      status: { type: "STRING" },
      explanation: { type: "STRING" },
      summary_for_scorer: { type: "STRING" },
      red_flags: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            quote: { type: "STRING" },
            explanation: { type: "STRING" }
          }
        }
      },
      green_flags: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            quote: { type: "STRING" },
            explanation: { type: "STRING" }
          }
        }
      }
    },
    required: ["status", "explanation", "summary_for_scorer", "red_flags", "green_flags"]
  },

  quantitativeScores: {
    type: "OBJECT",
    properties: {
      romantic_score: { type: "NUMBER" },
      commitment_score: { type: "NUMBER" },
      conflict_score: { type: "NUMBER" },
      effort_score: { type: "NUMBER" }
    },
    required: ["romantic_score", "commitment_score", "conflict_score", "effort_score"]
  },

  replySuggestions: {
    type: "OBJECT",
    properties: {
      replies: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["Spicy", "Casual", "Honest"] },
            text: { type: "STRING" },
            rationale: { type: "STRING" }
          }
        }
      }
    }
  }
};

// Optimized base API call function with caching
const callGemini = async (payload, cacheKey = null) => {
  // Check cache first if cache key is provided
  if (cacheKey) {
    const cached = geminiCache.get(cacheKey.prefix, cacheKey.data);
    if (cached) {
      return cached;
    }
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not configured");
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid API response structure");
    }

    const parsedResult = JSON.parse(result.candidates[0].content.parts[0].text);

    // Cache the result if cache key is provided
    if (cacheKey) {
      geminiCache.set(cacheKey.prefix, cacheKey.data, parsedResult);
    }

    return parsedResult;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse API response as JSON");
    }
    throw error;
  }
};

// Helper function to create standardized payloads
const createPayload = (prompt, schema) => ({
  contents: [{ role: "user", parts: [{ text: prompt }] }],
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema
  }
});

// Helper function to build persona and context instructions
const buildInstructions = ({ isSassy, isRelationship }) => ({
  personaInstruction: isSassy
    ? "Adopt a strong, sassy, and caring persona."
    : "Adopt a direct, insightful, and neutral tone.",
  contextInstruction: isRelationship
    ? "The user is in an established relationship."
    : "The user is NOT in an established relationship."
});

export const getQualitativeAnalysis = async (inputText, options) => {
  const { personaInstruction, contextInstruction } = buildInstructions(options);

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

  const cacheData = { inputText, options };
  return callGemini(
    createPayload(prompt, SCHEMAS.qualitativeAnalysis),
    { prefix: 'qual', data: cacheData }
  );
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

  return callGemini(
    createPayload(prompt, SCHEMAS.quantitativeScores),
    { prefix: 'quant', data: summary }
  );
};

export const getReplySuggestions = async (text, analysis, options) => {
  const { personaInstruction, contextInstruction } = buildInstructions(options);

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

  const cacheData = { text, analysis: { status: analysis.status, explanation: analysis.explanation }, options };
  return callGemini(
    createPayload(prompt, SCHEMAS.replySuggestions),
    { prefix: 'reply', data: cacheData }
  );
};

// Export cache utilities for debugging and management
export const cacheUtils = {
  clear: () => geminiCache.clear(),
  stats: () => geminiCache.getStats(),

  // Advanced cache management
  clearExpired: () => geminiCache._cleanup(),

  // For debugging - get cache contents (don't use in production)
  debug: () => ({
    cache: Array.from(geminiCache.cache.keys()),
    timestamps: Array.from(geminiCache.timestamps.entries()),
    accessOrder: [...geminiCache.accessOrder]
  })
};
