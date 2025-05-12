import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner } from '@ionic/angular/standalone';

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user_id?: number;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner
  ],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const apiUrl = '/wp-json/em/v1/login'; // Use proxy path
    const credentials = {
      email: this.email,
      password: this.password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    try {
      const response = await this.http.post<LoginResponse>(apiUrl, credentials, { headers }).toPromise();
      if (response && response.success) {
        localStorage.setItem('auth_token', response.token || 'logged_in');
        console.log('Login successful, response:', response);
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = response?.message || 'Invalid credentials or server issue';
      }
    } catch (error: unknown) {
      console.error('Login failed:', error);
      if (error instanceof HttpErrorResponse) {
        this.errorMessage = `Login failed: ${error.statusText} (Status: ${error.status}). Check CORS or server configuration.`;
        if (error.error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result as string;
            console.log('Error details:', text);
            this.errorMessage = `Login failed: ${text}`;
          };
          reader.readAsText(error.error);
        } else if (error.error && typeof error.error === 'object' && error.error.message) {
          this.errorMessage = `Login failed: ${error.error.message}`;
        }
      } else {
        this.errorMessage = 'Login failed due to an unknown error. Check console.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}