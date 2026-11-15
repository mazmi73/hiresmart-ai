import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmploymentType, ExperienceLevel, JobOffer, JobOfferRequest, JobStatus, Page, WorkplaceType } from '../models/job.models';
import { Application } from '../models/application.models';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient) {}

  searchJobs(
    keyword?: string,
    location?: string,
    employmentType?: EmploymentType | '',
    experienceLevel?: ExperienceLevel | '',
    page = 0,
    size = 10,
    workplaceType?: WorkplaceType | ''
  ): Observable<Page<JobOffer>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (keyword && keyword.trim()) {
      params = params.set('keyword', keyword.trim());
    }
    if (location && location.trim()) {
      params = params.set('location', location.trim());
    }
    if (employmentType) {
      params = params.set('employmentType', employmentType);
    }
    if (workplaceType) {
      params = params.set('workplaceType', workplaceType);
    }
    if (experienceLevel) {
      params = params.set('experienceLevel', experienceLevel);
    }

    return this.http.get<Page<JobOffer>>('/api/jobs', { params });
  }

  getAllJobs(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>('/api/jobs/all');
  }

  getSkills(query?: string): Observable<string[]> {
    let params = new HttpParams();
    if (query && query.trim()) {
      params = params.set('query', query.trim());
    }
    return this.http.get<string[]>('/api/jobs/skills', { params });
  }

  getJobById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`/api/jobs/${id}`);
  }

  createJob(job: JobOfferRequest): Observable<JobOffer> {
    return this.http.post<JobOffer>('/api/jobs', job);
  }

  updateJob(id: number, job: JobOfferRequest): Observable<JobOffer> {
    return this.http.put<JobOffer>(`/api/jobs/${id}`, job);
  }

  updateJobStatus(id: number, status: JobStatus): Observable<JobOffer> {
    return this.http.patch<JobOffer>(`/api/jobs/${id}/status`, { status });
  }

  updateJobThreshold(id: number, matchThreshold: number): Observable<JobOffer> {
    return this.http.patch<JobOffer>(`/api/jobs/${id}/threshold`, { matchThreshold });
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`/api/jobs/${id}`);
  }

  applyWithUpload(jobId: number, coverLetter: string, file: File): Observable<Application> {
    const formData = new FormData();
    if (coverLetter) {
      formData.append('coverLetter', coverLetter);
    }
    if (file) {
      formData.append('cvFile', file);
    }
    return this.http.post<Application>(`/api/jobs/${jobId}/apply`, formData);
  }

  applyWithSavedCv(jobId: number, coverLetter?: string, cvDocumentId?: number): Observable<Application> {
    let params = new HttpParams();
    if (coverLetter) params = params.set('coverLetter', coverLetter);
    if (cvDocumentId) params = params.set('cvDocumentId', cvDocumentId.toString());

    return this.http.post<Application>(`/api/jobs/${jobId}/apply-saved`, null, { params });
  }
}
