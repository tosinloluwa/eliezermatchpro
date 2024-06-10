import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonContent, IonSpinner, IonButton, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonContent, IonSpinner, IonButton, IonText],
})
export class HomePage implements OnInit {
  isLoading = true;
  showIframe = false;
  errorMessage: string | null = null;
  isOnline = navigator.onLine;

  constructor() {}

  ngOnInit() {
    this.checkInternetConnection();
    window.addEventListener('online', this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));
  }

  updateOnlineStatus() {
    this.isOnline = navigator.onLine;
    if (this.isOnline) {
      this.checkSiteAvailability();
    } else {
      this.isLoading = false;
      this.errorMessage = 'No internet connection. Please check your connection.';
      this.showIframe = false;
    }
  }

  checkInternetConnection() {
    this.updateOnlineStatus();
  }

  checkSiteAvailability() {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://quickhelp.com.ng/chat.php';
    iframe.style.display = 'none';

    iframe.onload = () => {
      this.isLoading = false;
      this.showIframe = true;
      this.errorMessage = null;
    };

    iframe.onerror = () => {
      this.isLoading = false;
      this.errorMessage = 'Unable to load chat. Please check your internet connection.';
    };

    document.body.appendChild(iframe);
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 5000); // Give the iframe some time to load before removing it
  }
}
