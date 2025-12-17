// src/app/components/chat-modal/chat-modal.component.ts
import { Component, Input, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Message {
  id: number;
  from_user: number;
  to_user: number;
  message: string;
  is_read: number;
  sent_at: string;
}

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ChatModalComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() userId!: number;
  @Input() userName!: string;
  @Input() currentUserId!: number;

  @ViewChild('messagesList') private messagesList!: ElementRef;

  messages: Message[] = [];
  newMessage = '';
  isLoading = true;
  private apiUrl = environment.apiUrl;
  private interval: any;
  private shouldScroll = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    console.log('ChatModal opened for userId:', this.userId, 'currentUserId:', this.currentUserId);
    if (!this.userId || !this.currentUserId) {
      console.error('Missing userId or currentUserId');
      this.isLoading = false;
      return;
    }
    this.loadMessages();
    this.interval = setInterval(() => this.loadMessages(), 3000); // Faster polling
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  loadMessages() {
    if (!this.userId) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('No auth token');
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<any>(`${this.apiUrl}api_messages.php?action=get&with=${this.userId}`, { headers })
      .subscribe({
        next: (res) => {
          console.log('Raw API response:', res);
          if (res.success && Array.isArray(res.messages)) {
            const oldLength = this.messages.length;
            this.messages = res.messages;
            this.shouldScroll = this.messages.length > oldLength || oldLength === 0;
            console.log('Messages loaded:', this.messages.length);
          } else {
            console.warn('No messages or invalid response');
            this.messages = [];
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load messages:', err);
          this.isLoading = false;
        }
      });
  }

  sendMessage() {
    const msg = this.newMessage.trim();
    if (!msg || !this.userId) return;

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const body = { to_user: this.userId, message: msg };

    this.http
      .post<any>(`${this.apiUrl}api_messages.php?action=send`, body, { headers })
      .subscribe({
        next: (res) => {
          console.log('Send response:', res);
          if (res.success) {
            this.newMessage = '';
            this.loadMessages();
          }
        },
        error: (err) => console.error('Send failed:', err)
      });
  }

  isMessageFromCurrentUser(message: Message): boolean {
    return message.from_user === this.currentUserId;
  }

  formatTime(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const mins = Math.floor(diff / 60000);
      const hrs = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (isNaN(date.getTime())) return 'Invalid';
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      if (hrs < 24) return `${hrs}h ago`;
      if (days < 7) return `${days}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Invalid';
    }
  }

  private scrollToBottom(): void {
    if (!this.messagesList) return;
    try {
      const el = this.messagesList.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) {}
  }
}