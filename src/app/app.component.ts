import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  providers: [SplashScreen]
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      console.log('Platform ready');

      try {
        // Perform any asynchronous initialization tasks here
        await this.performInitTasks();

        // Hide the splashscreen only when all init tasks are complete
        this.splashScreen.hide();
        console.log('Splashscreen hidden');
      } catch (error) {
        console.error('Error during app initialization:', error);
        // Even if there's an error, hide the splashscreen
        // so the user doesn't get stuck on it
        this.splashScreen.hide();
      }
    });
  }

  private async performInitTasks(): Promise<void> {
    // Simulate some asynchronous tasks
    // Replace these with your actual initialization tasks
    await this.delay(1000); // e.g., loading app settings
    console.log('App settings loaded');

    await this.delay(1500); // e.g., initializing plugins
    console.log('Plugins initialized');

    await this.delay(500); // e.g., checking user session
    console.log('User session checked');

    // You can add more tasks as needed
  }

  // Helper function to simulate async tasks
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}