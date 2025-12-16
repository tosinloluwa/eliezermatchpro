// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideIonicAngular, provideIonicModal } from '@ionic/angular/standalone';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideIonicAngular(),
    
    // THIS LINE IS THE FINAL FIX — MODALS NOW WORK ON REAL ANDROID DEVICES
    provideIonicModal()
  ],
};