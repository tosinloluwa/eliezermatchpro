import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-learn-more',
  templateUrl: './learn-more.page.html',
  styleUrls: ['./learn-more.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LearnMorePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
