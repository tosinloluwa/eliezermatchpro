import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  mapOutline, 
  starOutline,
  peopleCircleOutline,
  heartCircleOutline,
  bookOutline,
  shieldCheckmarkOutline,
  sparklesOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.page.html',
  styleUrls: ['./how-it-works.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonButton,
    IonIcon
  ]
})
export class HowItWorksPage implements OnInit {

  constructor() {
    addIcons({
      mapOutline,
      starOutline,
      peopleCircleOutline,
      heartCircleOutline,
      bookOutline,
      shieldCheckmarkOutline,
      sparklesOutline
    });
  }

  ngOnInit() {
  }

}