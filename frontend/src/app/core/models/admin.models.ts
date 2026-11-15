import { Role } from './auth.models';

export interface AdminStats {
  totalUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  totalAdmins: number;
  totalJobOffers: number;
  activeJobOffers: number;
  closedJobOffers: number;
  totalApplications: number;
  totalAnalyzedApplications: number;
  averageMatchScore: number;
  totalSkills?: number;
}

export interface Skill {
  id: number;
  name: string;
  normalizedName: string;
  category?: string;
  createdAt: string;
}

export interface SkillRequest {
  name: string;
  category?: string;
}

export interface AdminUser {
  id: number;
  email: string;
  role: Role;
  displayName: string;
  subDetails: string;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  titleOrLocation?: string;
}

export interface AuditLog {
  id: number;
  action: string;
  actorEmail: string;
  actorRole: string;
  targetResource: string;
  details: string;
  createdAt: string;
}

export interface SystemConfig {
  configKey: string;
  configValue: string;
  description: string;
  updatedAt: string;
}

export interface SystemTelemetry {
  dbStatus: string;
  jvmTotalMemoryMb: number;
  jvmFreeMemoryMb: number;
  jvmUsedMemoryMb: number;
  jvmMaxMemoryMb: number;
  javaVersion: string;
  osName: string;
  activeAiEngine: string;
  uptimeSeconds: number;
  uploadedCvsCount: number;
}

export interface SystemConfigResponse {
  configs: SystemConfig[];
  telemetry: SystemTelemetry;
}
