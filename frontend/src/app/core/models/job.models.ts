export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type WorkplaceType = 'ON_SITE' | 'HYBRID' | 'REMOTE';
export type ExperienceLevel = 'JUNIOR' | 'MID_LEVEL' | 'SENIOR' | 'LEAD';
export type JobStatus = 'ACTIVE' | 'CLOSED';

export interface JobOffer {
  id: number;
  recruiterId: number;
  title: string;
  description: string;
  companyName: string;
  location: string;
  employmentType: EmploymentType;
  workplaceType?: WorkplaceType;
  experienceLevel: ExperienceLevel;
  requiredSkills: string;
  status: JobStatus;
  createdAt: string;
  updatedAt?: string;
  applicantCount?: number;
  matchThreshold?: number;
}

export interface JobOfferRequest {
  title: string;
  description: string;
  companyName: string;
  location: string;
  employmentType: EmploymentType;
  workplaceType?: WorkplaceType;
  experienceLevel: ExperienceLevel;
  requiredSkills: string;
  matchThreshold?: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
