
import { GoogleGenAI } from "@google/genai";
import { ResearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResearchProfile = async (
  name: string,
  url: string,
  goal: string
): Promise<ResearchResult> => {
  const prompt = `
You are an Expert Psychographic Research Analyst. Your specialty is "Soft Signal Analysis"—extracting personality traits and behavioral patterns from public footprints (writing, interviews, social media).

TARGET: ${name}
CONTEXT URL: ${url || "Search based on name and professional context"}
RESEARCH GOAL: ${goal}

INSTRUCTIONS:
1. Analyze the subject's public presence to identify personality "buckets" (e.g., "The Visionary Architect," "The Data-Driven Pragmatist").
2. Create an "Interaction Playbook" based on inferred behavioral traits.
3. Synthesize standard professional data under a dynamic rubric aligned with the user's specific goal.

MANDATORY OUTPUT STRUCTURE (Markdown):

# Intelligence Dossier: ${name}

## 1. Executive Summary
**Strategic Fit:** How this person aligns with the goal: "${goal}". (2 sentences)
**Core Persona:** A summary of their professional identity and public "vibe".

## 2. Psychographic Analysis (Soft Signals)
(Identify 2-3 "Personality Buckets" based on their communication style and public focus.)

### Bucket: [Trait Name]
* [Description of how this trait manifests in their work or speech]
* [Evidence from public records/writing]

## 3. The Interaction Playbook
(Provide actionable behavioral advice)

*   **Communication Style:** (e.g., "Direct and brief; avoid small talk" or "Story-driven and conceptual")
*   **Energizing Topics:** (What makes them light up based on their interests/history)
*   **Friction Points:** (What they dislike, avoid, or find irritating)
*   **Behavioral Expectations:** (What to expect in a high-stakes setting)

## 4. Strategic Intelligence Rubric
(3-4 custom sections based strictly on the goal: ${goal})

### [Theme Title]
* [Data point/Insight]
* [Data point/Insight]

## 5. Final Analyst Note
**The "Gold" Insight:** The single most important, non-obvious thing to know before engaging.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2000 }
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
    throw new Error("Failed to generate dossier. Ensure the name is correct.");
  }
};
