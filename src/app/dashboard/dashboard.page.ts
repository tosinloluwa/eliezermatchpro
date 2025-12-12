  import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Router } from '@angular/router';
  import { ModalController, AlertController } from '@ionic/angular';
  import { FormsModule } from '@angular/forms';
  import { IonicModule } from '@ionic/angular';
  import { lastValueFrom } from 'rxjs';
  import { environment } from '../../environments/environment';

 import { QuestionnaireModalComponent } from '../components/questionnaire-modal/questionnaire-modal.component';
import { MessagesModalComponent } from '../components/messages-modal/messages-modal.component';
import { ChatModalComponent } from '../components/chat-modal/chat-modal.component';
import { PairModalComponent } from '../components/pair-modal/pair-modal.component';

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
    user_status: string;
    is_pending_approval: boolean;
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
      user_status: string;
    }>;
    total_pairs?: number;
    active_users_count?: number;
    pending_users_count?: number;
    rejected_users_count?: number;
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
    
    conversations: Conversation[] = [];
    messages: Message[] = [];
    chatPartnerId: number = 0;
    chatPartnerName: string = '';
    newMessage: string = '';
    chatRefreshInterval: any;
    
    pairUserId: number = 0;
    pairUserName: string = '';
    selectedPairWith: number = 0;

    // Filter state
    currentFilter: string = 'all';

    private apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef // <--- ADD THIS LINE
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

async loadDashboard(): Promise<void> {
  this.isLoading = true;
  this.errorMessage = '';

  const token = localStorage.getItem('auth_token');
  if (!token) {
    this.errorMessage = 'No authentication token found. Please log in.';
    this.router.navigate(['/login']);
    this.isLoading = false;
    return;
  }

  try {
    const data = await lastValueFrom(
  this.http.get<DashboardData>(`${this.apiUrl}dashboard.php`, { headers: this.getHeaders() })
);

    this.dashboardData = data;
    console.log('Dashboard loaded:', data);

    // Load conversations for Messages Modal
    this.loadConversations();

  } catch (error: any) {
    console.error('Failed to load dashboard:', error);
    this.errorMessage = error.statusText 
      ? `Error loading dashboard: ${error.statusText}` 
      : 'Network error. Please check your connection.';
  } finally {
    this.isLoading = false;
  }
}

    logout() {
      localStorage.removeItem('auth_token');
      this.router.navigate(['/login']);
    }

    // ===== USER APPROVAL METHODS (ADMIN ONLY) =====
    async approveUser(userId: number, userName: string) {
      const alert = await this.alertController.create({
        header: 'Approve User',
        message: `Approve ${userName}?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Approve',
            handler: () => {
              this.updateUserStatus(userId, 'active');
            }
          }
        ]
      });
      await alert.present();
    }

    async rejectUser(userId: number, userName: string) {
      const alert = await this.alertController.create({
        header: 'Reject User',
        message: `Reject ${userName}?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Reject',
            handler: () => {
              this.updateUserStatus(userId, 'rejected');
            }
          }
        ]
      });
      await alert.present();
    }

    async deactivateUser(userId: number, userName: string) {
      const alert = await this.alertController.create({
        header: 'Deactivate User',
        message: `Deactivate ${userName}?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Deactivate',
            handler: () => {
              this.updateUserStatus(userId, 'rejected');
            }
          }
        ]
      });
      await alert.present();
    }

    updateUserStatus(userId: number, status: string) {
      const body = {
        user_id: userId,
        status: status
      };

      this.http.post<any>(`${this.apiUrl}api_user_approval.php?action=update_status`, body, { headers: this.getHeaders() })
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.presentAlert('Success', 'User status updated successfully!');
              this.loadDashboard();
            } else {
              this.presentAlert('Error', response.error || 'Failed to update user status');
            }
          },
          error: (error) => {
            console.error('Failed to update user status:', error);
            this.presentAlert('Error', error.error?.error || 'Failed to update user status');
          }
        });
    }

    

    // ===== FILTER METHODS =====
    filterUsers(status: string) {
      this.currentFilter = status;
    }

    getFilteredUsers() {
      if (!this.dashboardData?.all_user_profiles) return [];
      
      if (this.currentFilter === 'all') {
        return this.dashboardData.all_user_profiles;
      }
      
      return this.dashboardData.all_user_profiles.filter(
        user => user.user_status === this.currentFilter
      );
    }

    // ===== STATUS HELPER METHODS =====
    getUserStatusBadgeClass(status: string): string {
      if (status === 'active') return 'active-badge';
      if (status === 'pending') return 'pending-badge';
      if (status === 'rejected') return 'rejected-badge';
      return '';
    }

    getUserStatusIcon(status: string): string {
      if (status === 'active') return 'checkmark-circle';
      if (status === 'pending') return 'time';
      if (status === 'rejected') return 'close-circle';
      return 'person';
    }

    canMessageUser(user: any): boolean {
      return user.user_status === 'active';
    }

    canPairUser(user: any): boolean {
      return !user.is_paired && user.user_status === 'active' && !user.roles.includes('administrator');
    }

    async openModal(userId?: number | null, profileId?: number) {
      console.log('openModal called.');
      let componentProps: any = {};

      if (userId && this.dashboardData?.responses) {
        componentProps.response = this.dashboardData.responses.find(r => r.id === userId) || null;
      } else if (profileId && this.dashboardData?.responses) {
        const userResponse = this.dashboardData.responses.find(r => r.user_id === profileId);
        componentProps.response = userResponse || null;
      } else {
        console.log('Opening Questionnaire Modal.');
        componentProps.response = null;
        componentProps.currentStep = 0;
      }

      const modal = await this.modalController.create({
        component: QuestionnaireModalComponent,
        componentProps,
        cssClass: 'auto-height-modal'
      });

      modal.onDidDismiss().then((result) => {
        if (result.data?.submitted) {
          this.loadDashboard();
        }
      });

      await modal.present();
      console.log('Modal presented, isOpen should be true internally.');
    }

async openMessagesModal() {
  this.loadConversations();  // ← ADD THIS

  const modal = await this.modalController.create({
    component: MessagesModalComponent,
    componentProps: {
      conversations: this.conversations,
      openChat: async (id: number, name: string) => {
        await modal.dismiss();
        this.openChatModal(id, name);
      }
    }
  });
  await modal.present();
}

async openChatModal(userId: number, userName: string) {
  const modal = await this.modalController.create({
    component: ChatModalComponent,
    componentProps: {
      userId,
      userName,
      currentUserId: this.dashboardData?.current_user.ID
    }
  });
  await modal.present();
}

async openPairModal(userId: number, userName: string) {
  const availableUsers = this.getAvailableUsersForPairing();

  const modal = await this.modalController.create({
    component: PairModalComponent,
    componentProps: {
      userId,
      userName,
      availableUsers  // ← ADD THIS
    }
  });

  modal.onDidDismiss().then((result) => {
    if (result.data?.submitted) {
      this.loadDashboard();
    }
  });

  await modal.present();
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
        user.user_status === 'active' &&
        !user.roles.includes('administrator') &&
        user.ID !== this.pairUserId
      );
    }

    isAdmin(): boolean {
      return this.dashboardData?.current_user.roles.includes('administrator') || false;
    }

    isPendingApproval(): boolean {
      return this.dashboardData?.is_pending_approval || false;
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

    getActiveUsersCount(): number {
      return this.dashboardData?.active_users_count || 0;
    }

    getPendingUsersCount(): number {
      return this.dashboardData?.pending_users_count || 0;
    }

    getRejectedUsersCount(): number {
      return this.dashboardData?.rejected_users_count || 0;
    }

  isPairedUser(profile: any): boolean {
      return profile.is_paired === true;
    }

    // ===== DELETE ACCOUNT METHOD =====
    async deleteAccount() {
      const alert = await this.alertController.create({
        header: 'Delete Account',
        message: 'Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Delete My Account',
            role: 'destructive',
            handler: () => {
              this.confirmDeleteAccount();
            }
          }
        ]
      });
      await alert.present();
    }

    async confirmDeleteAccount() {
      const alert = await this.alertController.create({
        header: 'Final Confirmation',
        message: 'Type "DELETE" to confirm permanent account deletion:',
        inputs: [
          {
            name: 'confirmation',
            type: 'text',
            placeholder: 'Type DELETE here'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Confirm Deletion',
            role: 'destructive',
            handler: (data) => {
              if (data.confirmation === 'DELETE') {
                this.performDeleteAccount();
                return true;
              } else {
                this.presentAlert('Error', 'You must type "DELETE" to confirm account deletion');
                return false;
              }
            }
          }
        ]
      });
      await alert.present();
    }

    performDeleteAccount() {
      const body = {
        user_id: this.dashboardData?.current_user.ID
      };

      this.http.post<any>(`${this.apiUrl}api_delete_account.php`, body, { headers: this.getHeaders() })
        .subscribe({
          next: async (response) => {
            if (response.success) {
              await this.presentAlert('Success', 'Your account has been permanently deleted. You will now be logged out.');
              localStorage.removeItem('auth_token');
              this.router.navigate(['/login']);
            } else {
              this.presentAlert('Error', response.error || 'Failed to delete account');
            }
          },
          error: (error) => {
            console.error('Failed to delete account:', error);
            this.presentAlert('Error', error.error?.error || 'Failed to delete account. Please try again.');
          }
        });
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