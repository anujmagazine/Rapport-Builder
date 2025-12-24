
import { GoogleGenAI } from "@google/genai";
import { ResearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResearchProfile = async (
  name: string,
  url: string,
  goal: string
): Promise<ResearchResult> => {
  const prompt = `
You are an Expert Intelligence Analyst. Your mission is to provide a dual-layer intelligence dossier on the subject.

TARGET: ${name}
CONTEXT URL: ${url || "Search based on name and professional context"}
RESEARCH GOAL: ${goal}

INSTRUCTIONS:
1. **Layer 1: Objective Footprint**: Scan for recent activity, news, interviews, and public posts from the last 12-18 months.
2. **Layer 2: Subjective Psychographics**: Extract "Soft Signals" to identify personality buckets and create a behavioral "Interaction Playbook".
3. **Synthesis**: Ensure all intelligence is filtered through the lens of the specific goal: "${goal}".

MANDATORY OUTPUT STRUCTURE (Markdown):

# Intelligence Dossier: ${name}

## Executive Summary
**Strategic Alignment:** 2 sentences on how they fit the goal.
**The "Vibe" Check:** A brief synthesis of their public persona.

## 1. Digital Footprint & Recent Activity
(List 3-5 specific, recent professional actions, interviews, or public statements. Be factual and dated if possible.)

## 2. Psychographic Analysis (Soft Signals)
(Categorize into 2-3 "Personality Buckets")
### Bucket: [Name]
* [Analysis of trait and how it manifests]

## 3. Interaction Playbook (CRITICAL)
(Behavioral advice for high-stakes interaction)
*   **How to Speak to Them:** (Tone, pace, level of detail)
*   **Energizing Topics:** (Subjects that trigger positive engagement)
*   **Friction Points & Dislikes:** (What to avoid at all costs)
*   **Behavioral Expectations:** (Predicted reactions in stressful or collaborative scenarios)

## 4. Strategic Rubric: ${goal}
(Custom analysis strictly relevant to the goal)

## 5. Analyst's Final Note
**The "Unfair Advantage":** One non-obvious secret to winning this engagement.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    const markdownContent = response.text || "Analysis could not be generated.";
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
    throw new Error("Failed to generate dossier. Connection or search timeout.");
  }
};
