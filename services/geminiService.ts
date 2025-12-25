
import { GoogleGenAI } from "@google/genai";
import { ResearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResearchProfile = async (
  name: string,
  url: string,
  goal: string
): Promise<ResearchResult> => {
  const prompt = `
You are an Elite Strategic Intelligence Analyst. Your task is to provide a high-signal, evidence-based tactical briefing for a meeting with ${name}.

TARGET: ${name}
URL: ${url || "Search for verified professional footprint"}
USER'S MEETING GOAL: ${goal}

### 🛑 STRICT INTEGRITY GUARDRAILS:
1. **NO METADATA READING**: Do NOT deduce personality from URL IDs, profile photo presence, or account timestamps.
2. **EVIDENCE-ONLY PSYCHOMETRICS**: You may categorize behavior into "buckets," but ONLY if you can cite specific evidence (e.g., "Based on 3 published articles on 'Disruptive Innovation' by ${name}, they fall into the 'Visionary Contrarian' bucket").
3. **GOAL ALIGNMENT**: Every insight must answer: "How does this specific fact help achieve the goal: ${goal}?"

### REQUIRED REPORT STRUCTURE (Markdown):

# Tactical Briefing: ${name}

## 🛡️ Intelligence Verification
**Data Confidence:** [High / Medium / Low]
**Reasoning:** (One concise line explaining the depth of the search results and identity certainty.)

## 📜 Professional Narrative
(One high-signal paragraph synthesizing their career trajectory, focus areas, and current professional standing. No fluff.)

## 🛠️ Competency & Leverage Matrix
| Competency Area | Verified Proof | How to Leverage for "${goal}" | Conversation Opener/Hint |
| :--- | :--- | :--- | :--- |
| [Skill/Expertise] | [Role/Project] | [Strategic Advice] | "[Sample phrasing]" |
| [Skill/Expertise] | [Role/Project] | [Strategic Advice] | "[Sample phrasing]" |

## 🧠 Psychographic Analysis & Buckets
(Identify 1-2 specific personality "buckets" based strictly on their public persona and actions.)
*   **Bucket: [Name of Profile Type]**
    *   **The Evidence:** (Cite a specific post, interview, or decision)
    *   **The Subject's Mindset:** (Deep insight into how they likely view their industry or role)

## 📔 Interaction Playbook
### The Communication Protocol
*   **Speech Style:** (Direct? Collaborative? Socratic? Abstract?)
*   **Energy Drivers:** (What topics or keywords excite them? Cite sources.)
*   **Dislikes/Friction Points:** (What to avoid—e.g., long decks, small talk, buzzwords)
*   **Expected Behavior:** (How will they likely behave in this meeting given your goal: "${goal}"?)

## 🎯 Executive Recommendation
One high-impact, actionable "North Star" piece of advice for this interaction.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 8000 }
      },
    });

    const markdownContent = response.text || "Strategic audit failed to generate.";
    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });
    }

    return { markdownContent, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Strategic research was blocked or failed. Ensure the target has a public footprint or provide a direct link.");
  }
};
