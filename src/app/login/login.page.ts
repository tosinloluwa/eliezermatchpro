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
      console.log('Debug: Validation failed - Empty email or password');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const apiUrl = 'https://eliezermatchpro.com/dashboard.php'; // Hardcoded URL
    const body = { email: this.email, password: this.password };
    const tempToken = btoa(`1:${Math.floor(Date.now() / 1000)}`); // Temporary token for login
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${tempToken}`,
      'Content-Type': 'application/json'
    });

    console.log('Debug: Starting login request');
    console.log('Debug: API URL:', apiUrl);
    console.log('Debug: Request Headers:', headers);
    console.log('Debug: Request Body:', body);

    try {
      const startTime = performance.now();
      const response = await this.http.post<LoginResponse>(apiUrl, body, { headers }).toPromise();
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (response) {
        console.log('Debug: Response received:', response);
        console.log(`Debug: Request duration: ${duration}ms`);
        if (response.current_user) {
          console.log('Debug: Login successful', response);
          const newToken = btoa(`${response.current_user.ID}:${Math.floor(Date.now() / 1000)}`);
          localStorage.setItem('auth_token', newToken);
          console.log('Debug: New token stored:', newToken);
          this.router.navigate(['/dashboard']);
        } else if (response.error) {
          this.errorMessage = `Login failed: ${response.error}`;
          console.log('Debug: Login failed due to error:', response.error);
        } else {
          this.errorMessage = 'Login failed: Unexpected response';
          console.log('Debug: Login failed - Unexpected response');
        }
      } else {
        this.errorMessage = 'Login failed: No response from server';
        console.log('Debug: Login failed - No response');
      }
    } catch (error: unknown) {
      console.error('Debug: Login failed for URL:', apiUrl, error);
      if (error instanceof HttpErrorResponse) {
        this.errorMessage = `Login failed: ${error.statusText} (Status: ${error.status}). Check server configuration.`;
        console.log('Debug: HTTP Error Details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error
        });
        if (error.error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result as string;
            console.log('Debug: Error Blob Details:', text);
            this.errorMessage = `Login failed: ${text}`;
          };
          reader.readAsText(error.error);
        } else if (error.error && typeof error.error === 'object' && error.error.message) {
          this.errorMessage = `Login failed: ${error.error.message}`;
          console.log('Debug: Error Message:', error.error.message);
        }
      } else {
        this.errorMessage = 'Login failed due to an unknown error. Check console.';
        console.log('Debug: Unknown Error:', error);
      }
    } finally {
      this.isLoading = false;
      console.log('Debug: Login process completed');
    }
  }
}