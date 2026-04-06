
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

## 📔 Interaction Playbook: Strategic Engagement
### Tactical Protocol
*   **[SPEECH STYLE]:** (Deep analysis of their communication style—e.g., "Direct and data-driven," "Visionary and metaphorical." Provide a specific example of a phrase or tone they use in public appearances or writing.)
*   **[ENERGY DRIVERS]:** (Identify 2-3 specific topics that trigger high engagement. For each, provide a "Bridge Question" you can use to pivot the conversation toward these topics.)
*   **[FRICTION POINTS]:** (Identify subtle triggers that cause withdrawal or defensiveness. Explain the psychological root of these triggers based on their career path.)
*   **[EXPECTED BEHAVIOR]:** (Predict their reaction to common meeting scenarios—e.g., "Will likely interrupt to ask for data," "Prefers to listen for 10 minutes before speaking.")

## ⚠️ Critical Avoidance: Tactical "No-Go" Zones
### High-Stakes Avoidance Matrix
*   **[AVOIDANCE]:** (Specific action, topic, or framing to avoid. Be extremely specific—e.g., "Do not mention their tenure at [Company X] as a 'learning experience'.")
*   **[REASONING]:** (Deep psychological or professional reasoning. Why is this a landmine? Connect it to a specific event or public sentiment they've expressed.)
*   **[CONSEQUENCE]:** (What happens if you fail this? e.g., "Immediate loss of credibility," "Triggers a defensive pivot to technicalities.")
*   **[REPLACEMENT STRATEGY]:** (What to do instead to achieve the same goal without the friction.)

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
