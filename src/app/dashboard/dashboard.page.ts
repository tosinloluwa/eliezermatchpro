import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { environment } from '../../environments/environment';

interface UserResponse {
  id: number;
  user_id: number;
  display_name: string;
  user_email: string;
  role_of_god?: string;
  christ_centered_marriage?: string;
  commitment_definition?: string;
  key_marriage_components?: string;
  relationship_with_christ?: string;
  bible_study_frequency?: string;
  financial_approach?: string;
  spiritual_differences?: string;
  marriage_goals?: string;
  raising_children?: string;
  conflict_resolution?: string;
  approach_forgiveness?: string;
  qualities_in_spouse?: string;
  marriage_readiness?: string;
}

interface Message {
  id: number;
  from_user: number;
  to_user: number;
  message: string;
  is_read: number;
  sent_at: string;
}

interface Conversation {
  user_id: number;
  user_name: string;
  user_email: string;
  last_message: string;
  unread: number;
  last_time: string;
}

interface PairedUser {
  ID: number;
  display_name: string;
  user_email: string;
}

interface DashboardData {
  current_user: {
    ID: number;
    display_name: string;
    user_email: string;
    roles: string[];
  };
  unread_count: number;
  is_paired: boolean;
  paired_with: PairedUser | null;
  responses?: UserResponse[];
  all_user_profiles?: Array<{
    ID: number;
    display_name: string;
    user_email: string;
    roles: string[];
    is_paired: boolean;
    pair_info?: { id: number; paired_at: string };
    paired_with?: { ID: number; display_name: string };
  }>;
  total_pairs?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class DashboardPage implements OnInit, OnDestroy {
  dashboardData: DashboardData | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  isModalOpen: boolean = false;
  isMessagesModalOpen: boolean = false;
  isChatModalOpen: boolean = false;
  isPairModalOpen: boolean = false;
  
  currentStep: number = 0;
  steps: string[] = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'];
  
  formData: any = {
    role_of_god: '',
    christ_centered_marriage: '',
    commitment_definition: '',
    key_marriage_components: '',
    relationship_with_christ: '',
    bible_study_frequency: '',
    financial_approach: '',
    spiritual_differences: '',
    marriage_goals: '',
    raising_children: '',
    conflict_resolution: '',
    approach_forgiveness: '',
    qualities_in_spouse: '',
    marriage_readiness: ''
  };
  
  selectedResponse: UserResponse | null = null;
  conversations: Conversation[] = [];
  messages: Message[] = [];
  chatPartnerId: number = 0;
  chatPartnerName: string = '';
  newMessage: string = '';
  chatRefreshInterval: any;
  
  pairUserId: number = 0;
  pairUserName: string = '';
  selectedPairWith: number = 0;

  private apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  ngOnDestroy() {
    if (this.chatRefreshInterval) {
      clearInterval(this.chatRefreshInterval);
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadDashboard() {
    this.isLoading = true;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.errorMessage = 'No authentication token found. Please log in.';
      this.router.navigate(['/login']);
      this.isLoading = false;
      return;
    }

    this.http.get<DashboardData>(`${this.apiUrl}dashboard.php`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          console.log('Dashboard loaded:', data);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load dashboard:', error);
          this.errorMessage = `Error loading dashboard: ${error.statusText}`;
          this.isLoading = false;
        }
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  // ===== QUESTIONNAIRE METHODS =====
  openModal(userId?: number | null, profileId?: number) {
    if (userId && this.dashboardData?.responses) {
      this.selectedResponse = this.dashboardData.responses.find(r => r.id === userId) || null;
      this.isModalOpen = true;
    } else if (profileId && this.dashboardData?.responses) {
      const userResponse = this.dashboardData.responses.find(r => r.user_id === profileId);
      this.selectedResponse = userResponse || null;
      this.isModalOpen = true;
    } else {
      this.selectedResponse = null;
      this.currentStep = 0;
      this.isModalOpen = true;
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedResponse = null;
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  submitForm() {
    const body = {
      user_id: this.dashboardData?.current_user.ID,
      ...this.formData
    };

    this.http.post(`${this.apiUrl}submit_questionnaire.php`, body, { headers: this.getHeaders() })
      .subscribe({
        next: (response: any) => {
          this.presentAlert('Success', response.message || 'Questionnaire submitted successfully!');
          if (response.status === 'success') {
            this.closeModal();
            this.loadDashboard();
          }
        },
        error: (error) => {
          console.error('Failed to submit questionnaire:', error);
          this.presentAlert('Error', 'Failed to submit questionnaire. Please try again.');
        }
      });
  }

  // ===== MESSAGING METHODS =====
  openMessagesModal() {
    this.isMessagesModalOpen = true;
    this.loadConversations();
  }

  closeMessagesModal() {
    this.isMessagesModalOpen = false;
  }

  loadConversations() {
    this.http.get<any>(`${this.apiUrl}api_messages.php?action=conversations`, { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.conversations = response.conversations;
            console.log('Conversations loaded:', this.conversations);
          }
        },
        error: (error) => {
          console.error('Failed to load conversations:', error);
        }
      });
  }

  openChatModal(userId: number, userName: string) {
    this.isChatModalOpen = true;
    this.chatPartnerId = userId;
    this.chatPartnerName = userName;
    this.newMessage = '';
    this.loadMessages(userId);
    
    // Auto-refresh messages every 5 seconds
    if (this.chatRefreshInterval) {
      clearInterval(this.chatRefreshInterval);
    }
    this.chatRefreshInterval = setInterval(() => {
      this.loadMessages(userId);
    }, 5000);
    
    // Mark messages as read
    this.markAsRead(userId);
  }

  closeChatModal() {
    this.isChatModalOpen = false;
    if (this.chatRefreshInterval) {
      clearInterval(this.chatRefreshInterval);
    }
    this.loadDashboard(); // Refresh to update unread count
  }

  loadMessages(userId: number) {
    this.http.get<any>(`${this.apiUrl}api_messages.php?action=get&with=${userId}`, { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.messages = response.messages;
            console.log('Messages loaded:', this.messages);
            // Scroll to bottom after messages load
            setTimeout(() => this.scrollToBottom(), 100);
          }
        },
        error: (error) => {
          console.error('Failed to load messages:', error);
        }
      });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const body = {
      to_user: this.chatPartnerId,
      message: this.newMessage
    };

    this.http.post<any>(`${this.apiUrl}api_messages.php?action=send`, body, { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.newMessage = '';
            this.loadMessages(this.chatPartnerId);
            // Scroll to bottom after sending
            setTimeout(() => this.scrollToBottom(), 100);
          } else {
            this.presentAlert('Error', response.error || 'Failed to send message');
          }
        },
        error: (error) => {
          console.error('Failed to send message:', error);
          this.presentAlert('Error', 'Failed to send message. Please try again.');
        }
      });
  }

  onMessageKeyPress(event: KeyboardEvent) {
    // Send message on Enter key (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom() {
    const messagesList = document.querySelector('.messages-list');
    if (messagesList) {
      messagesList.scrollTop = messagesList.scrollHeight;
    }
  }

  markAsRead(partnerId: number) {
    const body = { partner_id: partnerId };
    this.http.post<any>(`${this.apiUrl}api_messages.php?action=mark_read`, body, { headers: this.getHeaders() })
      .subscribe({
        next: () => {},
        error: (error) => console.error('Failed to mark as read:', error)
      });
  }

  isMessageFromCurrentUser(message: Message): boolean {
    return message.from_user === this.dashboardData?.current_user.ID;
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

  // ===== PAIRING METHODS (ADMIN ONLY) =====
  openPairModal(userId: number, userName: string) {
    this.isPairModalOpen = true;
    this.pairUserId = userId;
    this.pairUserName = userName;
    this.selectedPairWith = 0;
  }

  closePairModal() {
    this.isPairModalOpen = false;
  }

  async createPair() {
    if (!this.selectedPairWith) {
      this.presentAlert('Error', 'Please select a user to pair with');
      return;
    }

    const body = {
      user1_id: this.pairUserId,
      user2_id: this.selectedPairWith
    };

    this.http.post<any>(`${this.apiUrl}api_pairs.php?action=create`, body, { headers: this.getHeaders() })
      .subscribe({
        next: async (response) => {
          if (response.success) {
            await this.presentAlert('Success', 'Users paired successfully!');
            this.closePairModal();
            this.loadDashboard();
          } else {
            this.presentAlert('Error', response.error || 'Failed to create pair');
          }
        },
        error: (error) => {
          console.error('Failed to create pair:', error);
          this.presentAlert('Error', error.error?.error || 'Failed to create pair');
        }
      });
  }

  async unpairUsers(pairId: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Unpair',
      message: 'Are you sure you want to unpair these users?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Unpair',
          handler: () => {
            const body = { pair_id: pairId };
            this.http.post<any>(`${this.apiUrl}api_pairs.php?action=delete`, body, { headers: this.getHeaders() })
              .subscribe({
                next: (response) => {
                  if (response.success) {
                    this.presentAlert('Success', 'Users unpaired successfully!');
                    this.loadDashboard();
                  } else {
                    this.presentAlert('Error', response.error || 'Failed to unpair users');
                  }
                },
                error: (error) => {
                  console.error('Failed to unpair:', error);
                  this.presentAlert('Error', 'Failed to unpair users');
                }
              });
          }
        }
      ]
    });

    await alert.present();
  }

  getAvailableUsersForPairing() {
    if (!this.dashboardData?.all_user_profiles) return [];
    
    return this.dashboardData.all_user_profiles.filter(user => 
      !user.is_paired && 
      !user.roles.includes('administrator') &&
      user.ID !== this.pairUserId
    );
  }

  isAdmin(): boolean {
    return this.dashboardData?.current_user.roles.includes('administrator') || false;
  }

  // Helper methods for template
  getUnreadCount(): number {
    return this.dashboardData?.unread_count || 0;
  }

  isPaired(): boolean {
    return this.dashboardData?.is_paired || false;
  }

  getPairedWithName(): string {
    return this.dashboardData?.paired_with?.display_name || '';
  }

  getTotalPairs(): number {
    return this.dashboardData?.total_pairs || 0;
  }

  isPairedUser(profile: any): boolean {
    return profile.is_paired === true;
  }

  // ===== UTILITY METHODS =====
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}