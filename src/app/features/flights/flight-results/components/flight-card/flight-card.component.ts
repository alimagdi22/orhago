import { Component, inject, Input } from '@angular/core';
import { FlightResultService, FlightSearchService, IAirItinerary } from 'rp-travel-ui';
import { SharedService } from '../../../../../shared/shared.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.scss',
    animations: [
    trigger('flightAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class FlightCardComponent {
  @Input() airItineraries: IAirItinerary[] = [];

  sharedService = inject(SharedService);
  translate = inject(TranslateService);
  flightSearchService = inject(FlightSearchService);
  flightResultService = inject(FlightResultService);

  showMoreFlights = false;

  showFlightDetails(airItinerary: IAirItinerary, e: Event) {
    e.stopPropagation();
    this.sharedService.showFlightDetails(airItinerary);
  }
}
