// src/app/components/pair-modal/pair-modal.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pair-modal',
  templateUrl: './pair-modal.component.html',
  styleUrls: ['./pair-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class PairModalComponent {
  @Input() userId!: number;
  @Input() userName!: string;
  @Input() availableUsers: any[] = [];  // ← ADD THIS

  selectedPairWith = 0;
  private apiUrl = environment.apiUrl;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private alertCtrl: AlertController
  ) {}

  close() {
    this.modalCtrl.dismiss();
  }

  createPair() {
    if (!this.selectedPairWith) {
      this.presentAlert('Error', 'Please select a user to pair with');
      return;
    }
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const body = { user1_id: this.userId, user2_id: this.selectedPairWith };
    this.http
      .post<any>(`${this.apiUrl}api_pairs.php?action=create`, body, { headers })
      .subscribe({
        next: async (res) => {
          if (res.success) {
            await this.presentAlert('Success', 'Users paired successfully!');
            this.modalCtrl.dismiss({ submitted: true });
          } else {
            this.presentAlert('Error', res.error || 'Failed to create pair');
          }
        },
        error: () => this.presentAlert('Error', 'Failed to create pair')
      });
  }

  private async presentAlert(header: string, msg: string) {
    const a = await this.alertCtrl.create({ header, message: msg, buttons: ['OK'] });
    await a.present();
  }
}