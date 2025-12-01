export interface ResearchRequest {
  personName: string;
  linkedinUrl: string;
  researchGoal: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ResearchResult {
  markdownContent: string;
  sources: GroundingSource[];
}

export interface FormState {
  personName: string;
  linkedinUrl: string;
  researchGoal: string;
}