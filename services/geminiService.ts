
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
1. **NO METADATA READING**: Do NOT deduce personality from URL IDs or profile timestamps.
2. **EVIDENCE-ONLY PSYCHOMETRICS**: Categorize behavior into "buckets" ONLY if you can cite specific evidence.
3. **GOAL ALIGNMENT**: Every insight must help achieve: ${goal}.

### REQUIRED REPORT STRUCTURE (Markdown):

# Tactical Briefing: ${name}

## 🛡️ Intelligence Verification
**Data Confidence:** [High / Medium / Low]
**Reasoning:** (One concise line explaining the search depth.)

## 📜 Professional Narrative
(One high-signal paragraph synthesizing their career focus. Max 4 sentences.)

## 🛠️ Competency & Leverage Matrix

| Competency Area | Verified Proof | How to Leverage for "${goal}" | Conversation Opener/Hint |
| :--- | :--- | :--- | :--- |
| [Skill] | [Evidence] | [Strategy] | "[Exact Phrasing]" |

## 🧠 Psychographic Analysis
(Provide 4-5 distinct "Buckets" based on their public footprint. Use the exact format below for each.)

### Bucket: [Profile Name]
*   **The Essence:** (A one-line definition in simple, plain language explaining what this profile name means)
*   **Proof Point:** (Specific evidence from their history/published work)
*   **Operational Mindset:** (How they process decisions in this state)

## 📔 Interaction Playbook
### Tactical Protocol
*   **[SPEECH STYLE]:** (Direct? Collaborative? Abstract?)
*   **[ENERGY DRIVERS]:** (What topics/keywords excite them? Cite sources.)
*   **[FRICTION POINTS]:** (What they dislike or find annoying.)
*   **[EXPECTED BEHAVIOR]:** (Predicted interaction style for this meeting.)

## 🎯 Executive Recommendation
One high-impact piece of advice.
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
    throw new Error("Strategic research failed. Ensure the target has a public footprint.");
  }
};
