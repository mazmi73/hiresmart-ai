import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStats, AdminUser, AuditLog, CreateUserRequest, Skill, SkillRequest, SystemConfig, SystemConfigResponse } from '../models/admin.models';
import { JobOffer, JobOfferRequest } from '../models/job.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {}

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>('/api/admin/stats');
  }

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>('/api/admin/users');
  }

  createUser(request: CreateUserRequest): Observable<AdminUser> {
    return this.http.post<AdminUser>('/api/admin/users', request);
  }

  updateUserRole(userId: number, role: string): Observable<AdminUser> {
    return this.http.patch<AdminUser>(`/api/admin/users/${userId}/role`, { role });
  }

  deleteUser(userId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/admin/users/${userId}`);
  }

  getJobs(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>('/api/admin/jobs');
  }

  createJob(job: JobOfferRequest): Observable<JobOffer> {
    return this.http.post<JobOffer>('/api/admin/jobs', job);
  }

  toggleJobStatus(jobId: number): Observable<JobOffer> {
    return this.http.patch<JobOffer>(`/api/admin/jobs/${jobId}/status`, {});
  }

  deleteJob(jobId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/admin/jobs/${jobId}`);
  }

  getSystemConfig(): Observable<SystemConfigResponse> {
    return this.http.get<SystemConfigResponse>('/api/admin/config');
  }

  updateSystemConfig(key: string, value: string): Observable<SystemConfig> {
    return this.http.put<SystemConfig>('/api/admin/config', { key, value });
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>('/api/admin/audit-logs');
  }

  getSkills(query?: string, category?: string, sort: string = 'recent'): Observable<Skill[]> {
    let params: any = { sort };
    if (query && query.trim()) {
      params.query = query.trim();
    }
    if (category && category.trim()) {
      params.category = category.trim();
    }
    return this.http.get<Skill[]>('/api/admin/skills', { params });
  }

  createSkill(request: SkillRequest): Observable<Skill> {
    return this.http.post<Skill>('/api/admin/skills', request);
  }

  updateSkill(id: number, request: SkillRequest): Observable<Skill> {
    return this.http.put<Skill>(`/api/admin/skills/${id}`, request);
  }

  deleteSkill(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/admin/skills/${id}`);
  }
}
