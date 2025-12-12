// src/app/components/messages-modal/messages-modal.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

interface Conversation {
  user_id: number;
  user_name: string;
  user_email: string;
  last_message: string;
  unread: number;
  last_time: string;
}

@Component({
  selector: 'app-messages-modal',
  templateUrl: './messages-modal.component.html',
  styleUrls: ['./messages-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MessagesModalComponent {
  @Input() conversations: Conversation[] = [];
  @Input() openChat!: (id: number, name: string) => void;

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }

  formatTime(datetime: string): string {
    const date = new Date(datetime);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  // ADD THIS: Safe wrapper to prevent errors if openChat is undefined
  onConversationClick(conv: Conversation) {
    if (this.openChat) {
      this.openChat(conv.user_id, conv.user_name);
    }
  }
}