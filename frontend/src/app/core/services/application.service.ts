import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, ApplicationStatus, CVAnalysis } from '../models/application.models';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http: HttpClient) {}

  getApplicationDetails(id: number): Observable<Application> {
    return this.http.get<Application>(`/api/applications/${id}`);
  }

  updateStatus(id: number, status: ApplicationStatus): Observable<Application> {
    return this.http.patch<Application>(`/api/applications/${id}/status`, { status });
  }

  downloadCv(id: number): Observable<Blob> {
    return this.http.get(`/api/applications/${id}/cv/download`, { responseType: 'blob' });
  }

  analyzeApplication(id: number, engine?: string): Observable<CVAnalysis> {
    const options = engine ? { params: { engine } } : {};
    return this.http.post<CVAnalysis>(`/api/applications/${id}/analyze`, {}, options);
  }

  getAnalysis(id: number): Observable<CVAnalysis> {
    return this.http.get<CVAnalysis>(`/api/applications/${id}/analysis`);
  }
}
