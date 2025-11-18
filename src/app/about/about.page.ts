import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  heartCircleOutline, 
  starOutline, 
  mapOutline, 
  bookOutline, 
  peopleCircleOutline,
  checkmarkCircle,
  callOutline,
  mailOutline,
  globeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
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
export class AboutPage implements OnInit {

  constructor() {
    addIcons({
      heartCircleOutline,
      starOutline,
      mapOutline,
      bookOutline,
      peopleCircleOutline,
      checkmarkCircle,
      callOutline,
      mailOutline,
      globeOutline
    });
  }

  ngOnInit() {
  }

}