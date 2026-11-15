export type ApplicationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED';
export type AiProvider = 'LOCAL' | 'OLLAMA' | 'GEMINI' | 'GROQ' | 'MISTRAL';

export interface Application {
  id: number;
  jobOfferId: number;
  jobTitle: string;
  companyName: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  candidateTitle?: string;
  candidateSkills?: string;
  cvDocumentId?: number;
  cvOriginalName?: string;
  status: ApplicationStatus;
  coverLetter?: string;
  createdAt: string;
  updatedAt?: string;
  hasAnalysis?: boolean;
  matchPercentage?: number;
  matchedSkills?: string;
  missingSkills?: string;
  matchThreshold?: number;
  executionTimeMs?: number;
}

export interface CVAnalysis {
  id: number;
  applicationId: number;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  extractedSkills: string[];
  explanation: string;
  aiProvider: AiProvider;
  executionTimeMs?: number;
  createdAt: string;
}
