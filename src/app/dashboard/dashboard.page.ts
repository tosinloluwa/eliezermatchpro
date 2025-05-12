import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

interface UserResponse {
  id: number;
  user_id: number;
  display_name: string;
  user_email: string;
  role_of_god?: string;
  christ_centered_marriage?: string;
  commitment_definition?: string;
  key_marriage_components?: string;
  relationship_with_christ?: string;
  bible_study_frequency?: string;
  financial_approach?: string;
  spiritual_differences?: string;
  marriage_goals?: string;
  raising_children?: string;
  conflict_resolution?: string;
  approach_forgiveness?: string;
  qualities_in_spouse?: string;
  marriage_readiness?: string;
}

interface DashboardData {
  current_user: {
    ID: number;
    display_name: string;
    user_email: string;
    roles: string[];
  };
  responses?: UserResponse[];
  all_user_profiles?: Array<{
    ID: number;
    display_name: string;
    user_email: string;
    roles: string[];
  }>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class DashboardPage implements OnInit {
  dashboardData: DashboardData | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  isModalOpen: boolean = false;
  currentStep: number = 0;
  steps: string[] = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'];
  formData: any = {
    role_of_god: '',
    christ_centered_marriage: '',
    commitment_definition: '',
    key_marriage_components: '',
    relationship_with_christ: '',
    bible_study_frequency: '',
    financial_approach: '',
    spiritual_differences: '',
    marriage_goals: '',
    raising_children: '',
    conflict_resolution: '',
    approach_forgiveness: '',
    qualities_in_spouse: '',
    marriage_readiness: ''
  };
  selectedResponse: UserResponse | null = null;

  private apiUrl: string = 'https://eliezermatchpro.com/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.errorMessage = 'No authentication token found. Please log in.';
      this.router.navigate(['/login']);
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<DashboardData>(`${this.apiUrl}dashboard.php`, { headers })
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load dashboard:', error);
          this.errorMessage = 'Error loading dashboard. Please try again later.';
          this.isLoading = false;
        }
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  openModal(userId?: number | null, profileId?: number) {
    if (userId && this.dashboardData?.responses) {
      this.selectedResponse = this.dashboardData.responses.find(r => r.id === userId) || null;
      this.isModalOpen = true;
    } else if (profileId && this.dashboardData?.responses) {
      const userResponse = this.dashboardData.responses.find(r => r.user_id === profileId);
      this.selectedResponse = userResponse || null;
      this.isModalOpen = true;
    } else {
      this.selectedResponse = null;
      this.currentStep = 0;
      this.isModalOpen = true;
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedResponse = null;
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  submitForm() {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      user_id: this.dashboardData?.current_user.ID,
      ...this.formData
    };

    this.http.post(`${this.apiUrl}submit_questionnaire.php`, body, { headers })
      .subscribe({
        next: (response: any) => {
          alert(response.message);
          if (response.status === 'success') {
            this.closeModal();
            this.loadDashboard();
          }
        },
        error: (error) => {
          console.error('Failed to submit questionnaire:', error);
          alert('Failed to submit questionnaire. Please try again.');
        }
      });
  }
}