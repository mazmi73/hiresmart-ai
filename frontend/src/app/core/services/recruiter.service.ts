import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecruiterDashboardStats, RecruiterProfile, RecruiterProfileRequest } from '../models/recruiter.models';
import { JobOffer } from '../models/job.models';
import { Application } from '../models/application.models';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {

  constructor(private http: HttpClient) {}

  getProfile(): Observable<RecruiterProfile> {
    return this.http.get<RecruiterProfile>('/api/recruiters/profile');
  }

  updateProfile(profile: RecruiterProfileRequest): Observable<RecruiterProfile> {
    return this.http.put<RecruiterProfile>('/api/recruiters/profile', profile);
  }

  getDashboardStats(): Observable<RecruiterDashboardStats> {
    return this.http.get<RecruiterDashboardStats>('/api/recruiters/dashboard-stats');
  }

  getMyJobs(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>('/api/recruiters/jobs');
  }

  getJobApplications(jobId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`/api/recruiters/jobs/${jobId}/applications`);
  }

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>('/api/recruiters/applications');
  }
}
