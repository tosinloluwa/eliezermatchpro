// src/app/modal-registry.ts
// This file forces Angular to load all modal components at startup
// Path is correct when file is in src/app/

import { QuestionnaireModalComponent } from './components/questionnaire-modal/questionnaire-modal.component';
import { MessagesModalComponent } from './components/messages-modal/messages-modal.component';
import { ChatModalComponent } from './components/chat-modal/chat-modal.component';
import { PairModalComponent } from './components/pair-modal/pair-modal.component';

// Force inclusion in bundle
[QuestionnaireModalComponent, MessagesModalComponent, ChatModalComponent, PairModalComponent];