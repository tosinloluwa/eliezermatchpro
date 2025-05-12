import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { Dialogs } from '@awesome-cordova-plugins/dialogs/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem
  ],
  providers: [SplashScreen, Dialogs]
})
export class AppComponent {
  @ViewChild('mainMenu') menu!: IonMenu; // Reference to the IonMenu

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private dialogs: Dialogs,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      console.log('Platform ready');

      window.addEventListener('message', this.handleIframeMessage.bind(this), false);

      try {
        await this.performInitTasks();
        this.splashScreen.hide();
        console.log('Splashscreen hidden');
      } catch (error) {
        console.error('Error during app initialization:', error);
        if (this.platform.is('cordova')) {
          this.dialogs.alert('Failed to initialize the app. Please try again.', 'Error');
        }
        this.splashScreen.hide();
      }
    });
  }

  private async performInitTasks(): Promise<void> {
    console.log('App settings loaded');
  }

  private handleIframeMessage(event: MessageEvent) {
    if (event.data === 'quitApp') {
      this.quitApp();
    }
  }

  private quitApp() {
    if (this.platform.is('cordova')) {
      (navigator as any).app.exitApp();
    } else {
      console.log('Quit function is only available on device.');
    }
  }

  async navigateTo(path: string) {
    try {
      await this.router.navigate([`/${path}`]);
      console.log(`Navigated to /${path}`);
      await this.menu.close(); // Close the menu after navigation
      console.log('Menu closed');
    } catch (err) {
      console.error(`Navigation to /${path} failed:`, err);
    }
  }
}