import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

interface SignupResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
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
    IonSpinner,
    IonSelect,
    IonSelectOption
  ],
})
export class SignupPage {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  country: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  countries: string[] = [
    "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina",
    "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize",
    "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory",
    "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic",
    "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica",
    "Cote D'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland",
    "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar",
    "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
    "Heard Island and Mcdonald Islands", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
    "Luxembourg", "Macao", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
    "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montserrat",
    "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
    "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay",
    "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia",
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan",
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
    "Venezuela", "Vietnam", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
  ];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  async onSignup(form: NgForm) {
    if (!this.firstName || !this.lastName || !this.email || !this.country || !this.password) {
      this.errorMessage = 'Please fill in all required fields';
      console.log('Debug: Validation failed - Missing required fields');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      console.log('Debug: Validation failed - Password too short');
      return;
    }

    if (this.phone && !/^[0-9\s\-\+\(\)]{10,20}$/.test(this.phone)) {
      this.errorMessage = 'Please enter a valid phone number';
      console.log('Debug: Validation failed - Invalid phone');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const apiUrl = 'https://eliezermatchpro.com/signupx.php'; // Backend endpoint
    const body = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
      phone: this.phone || '',
      country: this.country
    };
    const tempToken = btoa(`1:${Math.floor(Date.now() / 1000)}`); // Temporary token mirroring login protocol
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${tempToken}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest' // Ensures AJAX detection in PHP
    });

    console.log('Debug: Starting signup request');
    console.log('Debug: API URL:', apiUrl);
    console.log('Debug: Request Headers:', headers);
    console.log('Debug: Request Body:', body);

    try {
      const startTime = performance.now();
      const response: SignupResponse | undefined = await this.http.post<SignupResponse>(apiUrl, body, { headers }).toPromise();
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (response) {
        console.log('Debug: Response received:', response);
        console.log(`Debug: Request duration: ${duration}ms`);
        if (response.success) {
          console.log('Debug: Signup successful', response);
          this.successMessage = response.message || 'Signup successful! Please check your email to verify your account.';
          form.resetForm();
          this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.phone = '';
          this.country = '';
          this.password = '';
          // Optional: Auto-redirect to login after success
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else if (response.error) {
          this.errorMessage = `Signup failed: ${response.error}`;
          console.log('Debug: Signup failed due to error:', response.error);
        } else {
          this.errorMessage = 'Signup failed: Unexpected response';
          console.log('Debug: Signup failed - Unexpected response');
        }
      } else {
        this.errorMessage = 'Signup failed: No response from server';
        console.log('Debug: Signup failed - No response');
      }
    } catch (error: unknown) {
      console.error('Debug: Signup failed for URL:', apiUrl, error);
      if (error instanceof HttpErrorResponse) {
        this.errorMessage = `Signup failed: ${error.statusText} (Status: ${error.status}). Check server configuration.`;
        console.log('Debug: HTTP Error Details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error
        });
        if (error.status === 0) {
          this.errorMessage = 'CORS/Network error: Ensure server has CORS headers for localhost. URL: ' + error.url;
          console.log('Debug: Likely CORS block or network failure');
        }
        if (error.error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result as string;
            console.log('Debug: Error Blob Details:', text);
            this.errorMessage = `Signup failed: ${text}`;
          };
          reader.readAsText(error.error);
        } else if (error.error && typeof error.error === 'object' && error.error.error) {
          this.errorMessage = error.error.error; // Handle JSON error from PHP
          console.log('Debug: Error Message:', error.error.error);
        } else if (typeof error.error === 'string' && error.error.includes('already exists')) {
          this.errorMessage = 'Email already exists. Please log in or use a different email.';
          console.log('Debug: Detected email exists error');
        }
      } else {
        this.errorMessage = 'Signup failed due to an unknown error. Check console.';
        console.log('Debug: Unknown Error:', error);
      }
    } finally {
      this.isLoading = false;
      console.log('Debug: Signup process completed');
    }
  }
}