export interface CandidateProfile {
  id?: number;
  userId?: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  title?: string;
  education?: string;
  experienceSummary?: string;
  skills?: string;
  hasCv: boolean;
  cvId?: number;
  cvOriginalName?: string;
}

export interface CandidateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  title?: string;
  education?: string;
  experienceSummary?: string;
  skills?: string;
}
