import { Component, inject, Input } from '@angular/core';
import { HomePageService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-max-min-price',
  templateUrl: './max-min-price.component.html',
  styleUrl: './max-min-price.component.scss',
})
export class MaxMinPriceComponent {
  @Input({ required: true }) price = 0;
  @Input({ required: true }) title = '';

  homePageService = inject(HomePageService);
}
