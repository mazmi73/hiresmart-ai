import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { ResetPasswordComponent } from './pages/auth/reset-password.component';
import { JobListComponent } from './pages/jobs/job-list.component';
import { JobDetailComponent } from './pages/jobs/job-detail.component';
import { CandidateDashboardComponent } from './pages/candidate/candidate-dashboard.component';
import { CandidateProfileComponent } from './pages/candidate/candidate-profile.component';
import { RecruiterDashboardComponent } from './pages/recruiter/recruiter-dashboard.component';
import { RecruiterProfileComponent } from './pages/recruiter/recruiter-profile.component';
import { RecruiterJobsComponent } from './pages/recruiter/recruiter-jobs.component';
import { RecruiterJobFormComponent } from './pages/recruiter/recruiter-job-form.component';
import { RecruiterApplicationsComponent } from './pages/recruiter/recruiter-applications.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminUsersComponent } from './pages/admin/admin-users.component';
import { AdminJobsComponent } from './pages/admin/admin-jobs.component';
import { AdminAuditComponent } from './pages/admin/admin-audit.component';
import { AdminSystemComponent } from './pages/admin/admin-system.component';
import { AdminSkillsComponent } from './pages/admin/admin-skills.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { candidateGuard } from './core/guards/candidate.guard';
import { recruiterGuard } from './core/guards/recruiter.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Public routes & aliases
  { path: '', component: LandingComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'auth/login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'auth/register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'auth/reset-password', component: ResetPasswordComponent },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },

  // Administrator routes
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/skills',
    component: AdminSkillsComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/jobs',
    component: AdminJobsComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/audit',
    component: AdminAuditComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/system',
    component: AdminSystemComponent,
    canActivate: [authGuard, adminGuard]
  },

  // Candidate routes
  {
    path: 'candidate/dashboard',
    component: CandidateDashboardComponent,
    canActivate: [authGuard, candidateGuard]
  },
  {
    path: 'candidate/applications',
    component: CandidateDashboardComponent,
    canActivate: [authGuard, candidateGuard]
  },
  {
    path: 'candidate/profile',
    component: CandidateProfileComponent,
    canActivate: [authGuard, candidateGuard]
  },

  // Recruiter routes
  {
    path: 'recruiter/dashboard',
    component: RecruiterDashboardComponent,
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'recruiter/profile',
    component: RecruiterProfileComponent,
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'recruiter/jobs',
    component: RecruiterJobsComponent,
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'recruiter/jobs/new',
    component: RecruiterJobFormComponent,
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'recruiter/jobs/:id/edit',
    component: RecruiterJobFormComponent,
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'recruiter/jobs/:jobId/applications',
    component: RecruiterApplicationsComponent,
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'recruiter/applications',
    component: RecruiterApplicationsComponent,
    canActivate: [authGuard, recruiterGuard]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
