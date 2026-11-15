import { Application } from './application.models';

export interface RecruiterProfile {
  id?: number;
  userId?: number;
  email: string;
  companyName: string;
  companyDescription?: string;
  website?: string;
  location?: string;
}

export interface RecruiterProfileRequest {
  companyName: string;
  companyDescription?: string;
  website?: string;
  location?: string;
}

export interface RecruiterDashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  applicationsUnderReview: number;
  recentApplications: Application[];
}
