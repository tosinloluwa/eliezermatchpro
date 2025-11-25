import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Testimony {
  id: number;
  name: string;
  image?: string;
  testimony: string;
  date: string;
  location: string;
}

interface TestimonialsResponse {
  success: boolean;
  testimonials: Testimony[];
  total_count: number;
}

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.page.html',
  styleUrls: ['./testimonials.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TestimonialsPage implements OnInit {
  testimonials: Testimony[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadTestimonials();
  }

  loadTestimonials() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<TestimonialsResponse>(`${this.apiUrl}testimonials.php`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.testimonials = response.testimonials;
            console.log('Testimonials loaded:', this.testimonials);
          } else {
            this.errorMessage = 'Failed to load testimonials';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load testimonials:', error);
          this.errorMessage = 'Error loading testimonials. Please try again later.';
          this.isLoading = false;
        }
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}