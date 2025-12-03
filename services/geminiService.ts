import { GoogleGenAI } from "@google/genai";
import { ResearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResearchProfile = async (
  name: string,
  url: string,
  goal: string
): Promise<ResearchResult> => {
  const prompt = `
You are an Expert Intelligence Analyst, specializing in creating high-impact, action-oriented professional dossiers. Your primary function is to analyze a user's stated research goal and dynamically generate a relevant research rubric, then populate that rubric with verifiable, up-to-date information. Your output must be a concise, structured intelligence report designed for optimal decision-making.

INSTRUCTION SET & VARIABLES:

TARGET PERSON: ${name}

LINKEDIN/CONTEXT URL: ${url || "Not provided, please search based on name and context"}

RESEARCH CONTEXT & GOAL: ${goal}

CORE TASK SEQUENCE:

1. Dynamic Rubric Creation: Based only on the 'RESEARCH CONTEXT & GOAL', formulate a 4-5 point thematic rubric. Each point must represent a critical area of insight required for this specific objective.
2. Information Synthesis & Grounding: Use Google Search grounding to gather recent, verifiable information about ${name}, their company, and their professional background.
3. Executive Synthesis: Distill the most vital findings into a high-level summary at the very beginning.
4. Organization and Population: Organize all synthesized information exclusively under the sections defined by your dynamic rubric. Focus on strategic insights, not just biographical facts.

MANDATORY OUTPUT STRUCTURE (Markdown):

# Intelligence Dossier: ${name}

## Executive Summary
**Snapshot:** A 3-5 bullet point high-level summary of the most critical intelligence gathered. This must allow the user to grasp the essence of the person and the strategic viability of the goal immediately without reading the full report. Focus on the "So What?".

## 1. Context & Core Persona

**Stated Objective:** A direct, 1-sentence restatement of the 'Research Context & Goal'.

**Key Persona Insights:** A 2-3 sentence summary of their current role, professional trajectory, and general public focus derived from the research.

## 2. Dynamic Intelligence Rubric

(Generate 4-5 thematic points based on the research goal. Use Level 3 Headings (###) for these themes.)

### [Theme 1 Title]
*   [Insight/Data Point 1]
*   [Insight/Data Point 2]
*   [Insight/Data Point 3]

### [Theme 2 Title]
... (continue for all points)

## 3. Strategic Takeaways

**Key Conversation/Decision Driver:** A single, high-impact topic or fact derived from the research that is most critical to the user's goal. (1 sentence)

**Analyst Note:** The single most important research insight the user should keep in mind. (1 sentence)

Ensure the entire output is strictly organized by this structure, professional in tone, and highly relevant to the stated goal.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const markdownContent = response.text || "No analysis could be generated. Please try again.";

    // Extract sources from grounding chunks
    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title,
          });
        }
      });
    }

    return {
      markdownContent,
      sources,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate intelligence dossier. Please check your inputs and try again.");
  }
};