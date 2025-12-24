
import { GoogleGenAI } from "@google/genai";
import { ResearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResearchProfile = async (
  name: string,
  url: string,
  goal: string
): Promise<ResearchResult> => {
  const prompt = `
You are an Expert Intelligence Analyst specializing in Human Behavior and Strategic Communication.

TARGET: ${name}
CONTEXT URL: ${url || "Search based on name and professional context"}
RESEARCH GOAL: ${goal}

INSTRUCTIONS:
1. **Plain Language Mandate**: Use accessible, everyday language. Avoid industry buzzwords or unexplained corporate jargon (e.g., instead of "Level-5 Leader," use "A humble yet fiercely determined leader who prioritizes the team's success over personal glory").
2. **Layer 1: Objective Activity**: Scan for recent news, posts, and public activity from the last 18 months.
3. **Layer 2: Multi-Dimensional Psychographics**: Identify **3-5 distinct personality buckets**. Provide depth by explaining how these traits interact.
4. **Layer 3: Behavioral Playbook**: Create an actionable "How-to" guide for interacting with this person based on their character profile.

MANDATORY OUTPUT STRUCTURE (Markdown):

# Intelligence Dossier: ${name}

## Executive Summary
**Strategic Fit:** (2 sentences in plain English on how they align with the goal: "${goal}")
**The Persona:** (A descriptive, jargon-free summary of their public identity)

## 1. Digital Footprint & Recent Activity
(List 3-5 specific, recent actions or news points. Explain the significance of each in simple terms.)

## 2. Deep Psychographic Spectrum
(Identify 3-5 "Personality Buckets". Use descriptive names like "The Cautious Strategist" or "The Enthusiastic Storyteller")

### Bucket: [Descriptive Name]
* **The Behavior:** [Plain English description of how this trait looks in the real world]
* **The Evidence:** [Specific observation from their public footprint]
* **Why it Matters:** [How this affects your interaction]

## 3. Interaction Playbook (Actionable)
*   **The Best Approach:** (How to start a conversation or meeting)
*   **What Energizes Them:** (Topics or styles they respond positively to)
*   **What Drains or Irritates Them:** (Behavioral friction points to avoid)
*   **Response Patterns:** (What to expect when they are challenged or interested)

## 4. Strategic Analysis: ${goal}
(3 custom sections tailored to the goal, using zero jargon)

## 5. Analyst's Secret
**The "Closing Insight":** One simple, non-obvious piece of advice that would make an interaction successful.
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
