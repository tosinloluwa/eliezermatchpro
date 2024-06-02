import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonButton, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonButton, IonText],
})
export class HomePage implements OnInit {
  isLoading = true;
  isLoaded = false;
  showIframe = false;
  errorMessage: string | null = null;

  constructor() {}

  ngOnInit() {
    this.checkSiteAvailability();
  }

  checkSiteAvailability() {
    console.log('Checking site availability...');
    const iframe = document.createElement('iframe');
    iframe.src = 'https://quickhelp.com.ng/chat.php';
    iframe.style.display = 'none';

    iframe.onload = () => {
      console.log('Iframe loaded successfully');
      this.isLoaded = true;
      this.isLoading = false;
    };

    iframe.onerror = () => {
      console.log('Iframe failed to load');
      this.errorMessage = 'Unable to load chat. Please check your internet connection.';
      this.isLoading = false;
    };

    document.body.appendChild(iframe);
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 5000); // Give the iframe some time to load before removing it
  }

  showChat() {
    this.showIframe = true;
    this.errorMessage = null;
  }
}
