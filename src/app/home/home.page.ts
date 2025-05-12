import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonButton, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { callOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonButton,
    IonFab,
    IonFabButton,
    IonIcon
  ],
})
export class HomePage {
  constructor(private router: Router) {
    addIcons({ callOutline });
  }

  goToSignUp() {
    try {
      this.router.navigate(['/signup']);
    } catch (error) {
      console.error('Navigation to signup failed:', error);
    }
  }

  goToLogin() {
    try {
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Navigation to login failed:', error);
    }
  }

  goToLearnMore() {
    try {
      this.router.navigate(['/learn-more']);
    } catch (error) {
      console.error('Navigation to learn-more failed:', error);
    }
  }
}