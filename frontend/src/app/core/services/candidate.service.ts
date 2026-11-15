import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CandidateProfile, CandidateProfileRequest } from '../models/candidate.models';
import { Application } from '../models/application.models';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient) {}

  getProfile(): Observable<CandidateProfile> {
    return this.http.get<CandidateProfile>('/api/candidates/profile');
  }

  updateProfile(profile: CandidateProfileRequest): Observable<CandidateProfile> {
    return this.http.put<CandidateProfile>('/api/candidates/profile', profile);
  }

  uploadCv(file: File): Observable<CandidateProfile> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CandidateProfile>('/api/candidates/cv', formData);
  }

  downloadMyCv(): Observable<Blob> {
    return this.http.get('/api/candidates/cv/download', { responseType: 'blob' });
  }

  getMyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>('/api/candidates/applications');
  }
}
