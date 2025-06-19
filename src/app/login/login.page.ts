import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner } from '@ionic/angular/standalone';

interface LoginResponse {
  current_user?: {
    ID: number;
    display_name: string;
    user_email: string;
    roles: string[];
  };
  error?: string;
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

    const apiUrl = '/dashboard.php'; // Updated to match server
    const token = btoa(`${1}:${Math.floor(Date.now() / 1000)}`);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const response = await this.http.get<LoginResponse>(apiUrl, { headers }).toPromise();
      if (response) {
        console.log('Response:', response);
        if (response.current_user) {
          console.log('Login successful', response);
          localStorage.setItem('auth_token', token);
          this.router.navigate(['/dashboard']);
        } else if (response.error) {
          this.errorMessage = `Login failed: ${response.error}`;
        } else {
          this.errorMessage = 'Login failed: Unexpected response';
        }
      } else {
        this.errorMessage = 'Login failed: No response from server';
      }
    } catch (error: unknown) {
      console.error('Login failed for URL:', apiUrl, error);
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