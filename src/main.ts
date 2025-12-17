// src/main.ts
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// FORCE EAGER LOAD ALL MODAL COMPONENTS — THIS IS THE ONLY THING THAT WORKS ON EVERY DEVICE
import './app/components/questionnaire-modal/questionnaire-modal.component';
import './app/components/messages-modal/messages-modal.component';
import './app/components/chat-modal/chat-modal.component';
import './app/components/pair-modal/pair-modal.component';

// If using modal-registry.ts, use this (assuming it's in src/app/)
import './app/modal-registry';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient()
  ],
});