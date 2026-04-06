
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { ResearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResearchProfile = async (
  name: string,
  url: string,
  goal: string
): Promise<ResearchResult> => {
  // Extract identifier from URL if possible to help the search (e.g., 'nikhilmittalnsit')
  const urlParts = url ? url.replace(/\/$/, "").split('/') : [];
  const urlIdentifier = urlParts.length > 0 ? urlParts[urlParts.length - 1] : "";

  const prompt = `
[MISSION: CRITICAL TACTICAL RESEARCH]
TARGET_NAME: ${name}
TARGET_URL: ${url || "NOT PROVIDED"}
URL_IDENTIFIER_ANCHOR: ${urlIdentifier}
USER_GOAL: ${goal}

[RESEARCH & VERIFICATION PROTOCOL]
1. **SEARCH**: Perform a deep search using Google Search. Focus on finding the profile associated with the URL_IDENTIFIER_ANCHOR ("${urlIdentifier}").
2. **MATCHING**: You MUST confirm that the person's professional background (e.g., Education from NSIT/NSUT, specific companies) aligns with the specific identifier provided in the URL.
3. **DO NOT SUMMARIZE GENERIC NAMES**: If multiple people exist with the name "${name}", ignore them all except the one matching "${urlIdentifier}". 
4. **IDENTITY SNAPSHOT**: Your report MUST begin with a "Verified Identity Snapshot" to confirm to the user you have the correct person.
5. **EXIT CLAUSE**: If you cannot find high-confidence data matching the specific identifier "${urlIdentifier}", you MUST output: "IDENTITY MISMATCH: Could not verify identity for identifier ${urlIdentifier}."

### REQUIRED REPORT STRUCTURE (Markdown):

# Tactical Briefing: ${name}

## 🛡️ Verified Identity Snapshot
*   **Current Role:** [Found Role]
*   **Organization:** [Found Organization]
*   **Key Education Anchor:** [e.g. NSIT / NSUT / University Name]
*   **Data Confidence:** [High / Medium / Low]
*   **Verification Note:** (Briefly explain how you confirmed this is the correct "${urlIdentifier}")

## 📜 Professional Narrative
(A high-signal synthesis of their career trajectory based ONLY on verified search results.)

## 🛠️ Competency & Leverage Matrix

| Competency Area | Verified Proof | Strategic Leverage for "${goal}" | Recommended Opener |
| :--- | :--- | :--- | :--- |
| [Skill] | [Evidence] | [Strategy] | "[Phrasing]" |

## 🧠 Psychographic Analysis
### Bucket: [Profile Name]
*   **The Essence:** (Definition of their professional persona)
*   **Proof Point:** (Specific evidence from their public footprint)
*   **Operational Mindset:** (How they process decisions)

## 📔 Interaction Playbook
### Tactical Protocol
*   **[SPEECH STYLE]:** (Based on writing/interviews found)
*   **[ENERGY DRIVERS]:** (Topics of high engagement)
*   **[FRICTION POINTS]:** (Avoid these topics)
*   **[EXPECTED BEHAVIOR]:** (Interaction style prediction)

## ⚠️ Critical Avoidance: What Not To Do
### Tactical "No-Go" Zones
*   **[AVOIDANCE]:** (Specific action/topic to avoid)
*   **[REASONING]:** (Why this would be counter-productive for this specific person)

## 🎯 Executive Recommendation
One high-impact piece of advice tailored to "${goal}".
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are a World-Class Strategic Intelligence Analyst. 
        Accuracy is your only metric for success. 
        You MUST use the Google Search tool to anchor identity. 
        If a URL identifier like "${urlIdentifier}" is provided, you treat it as the absolute anchor for identity. 
        Ignore generic information about common names. 
        You extract tactical insights from real-time search data, never from internal training hallucinations.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      },
    });

    const markdownContent = response.text || "Strategic audit failed to generate.";
    
    if (markdownContent.includes("IDENTITY MISMATCH") || markdownContent.includes("INSUFFICIENT DATA")) {
       throw new Error(`Identity verification failed. Could not find a high-confidence public match for the specific profile: ${urlIdentifier}`);
    }

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
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Strategic research failed.");
  }
};
