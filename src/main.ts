// src/main.ts
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// ADD THESE IMPORTS — FORCES COMPONENT REGISTRATION FOR MODALS
import { QuestionnaireModalComponent } from './app/components/questionnaire-modal/questionnaire-modal.component';
import { MessagesModalComponent } from './app/components/messages-modal/messages-modal.component';
import { ChatModalComponent } from './app/components/chat-modal/chat-modal.component';
import { PairModalComponent } from './app/components/pair-modal/pair-modal.component';

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