// src/app/components/questionnaire-modal/questionnaire-modal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

@Component({
  selector: 'app-questionnaire-modal',
  templateUrl: './questionnaire-modal.component.html',
  styleUrls: ['./questionnaire-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class QuestionnaireModalComponent implements OnInit {
  @Input() response: UserResponse | null = null;
  @Input() currentStep = 0;

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

  steps = 7;
  private apiUrl = environment.apiUrl;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (this.response) {
      Object.assign(this.formData, this.response);
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  nextStep() {
    if (this.currentStep < this.steps - 1) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 0) this.currentStep--;
  }

  async submitForm() {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http
      .post(`${this.apiUrl}submit_questionnaire.php`, this.formData, { headers })
      .subscribe({
        next: async (res: any) => {
          const alert = await this.alertCtrl.create({
            header: 'Success',
            message: res.message || 'Questionnaire submitted!',
            buttons: ['OK']
          });
          await alert.present();
          this.modalCtrl.dismiss({ submitted: true });  
        },
        error: async () => {
          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: 'Failed to submit questionnaire.',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
  }
}