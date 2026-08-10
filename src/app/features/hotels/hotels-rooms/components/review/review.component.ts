import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
 showPopup = false;

  reviews = [
    {
      name: 'Adrian',
      country: 'Argentina',
      flag: 'https://flagcdn.com/w20/ar.png',
      text: '“A wonderful experience in a special place. Thank you to all the staff.”',
    },
    {
      name: 'Sophie',
      country: 'France',
      flag: 'https://flagcdn.com/w20/fr.png',
      text: '“Beautiful location and friendly staff! Highly recommend.”',
    },
    {
      name: 'Kenji',
      country: 'Japan',
      flag: 'https://flagcdn.com/w20/jp.png',
      text: '“Clean rooms, excellent service. Will visit again.”',
    },
  ];

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}
