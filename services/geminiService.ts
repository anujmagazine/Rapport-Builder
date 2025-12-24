
import { GoogleGenAI } from "@google/genai";
import { ResearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResearchProfile = async (
  name: string,
  url: string,
  goal: string
): Promise<ResearchResult> => {
  const prompt = `
You are a High-Level Communication Strategist.

TARGET: ${name}
CONTEXT URL: ${url || "Search based on name and professional context"}
RESEARCH GOAL: ${goal}

INSTRUCTIONS:
1. **Plain Language**: Use clear, everyday English. Avoid jargon like "synergy," "growth-mindset," or "value-add."
2. **Layer 1: Objective Activity**: Scan for recent news, LinkedIn activity, and professional projects from the last 12-18 months.
3. **Layer 2: Multi-Dimensional Psychographics**: Break their personality into 3-5 distinct "buckets." Use descriptive names (e.g., "The Rapid-Fire Thinker" instead of "High conscientiousness").
4. **Layer 3: Interaction Playbook**: Create an actionable "How-to" guide for meeting this person based on their public character.

MANDATORY OUTPUT STRUCTURE (Markdown):

# Insight Profile: ${name}

## Executive Summary
**Strategic Context:** (How this person aligns with: "${goal}")
**The Persona:** (A 2-sentence summary of who they are publicly)

## 1. Digital Footprint
(List 3 specific, recent actions/news points. Explain why each matters to you in plain terms.)

## 2. The Personality Spectrum
(Define 3-5 Buckets)

### Bucket: [Name]
* **The Trait:** [Description]
* **The Evidence:** [Based on their activity]
* **Why it Matters:** [How to use this knowledge]

## 3. Meeting Playbook (Actionable)
*   **The Best Approach:** (How to start the meeting)
*   **What Energizes Them:** (Topics/Styles to use)
*   **What Irritates Them:** (Behavioral friction to avoid)

## 4. Closing Insight
One simple piece of advice that makes an interaction with ${name} successful.
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
    throw new Error("Search timed out. Please try again in a moment.");
  }
};
