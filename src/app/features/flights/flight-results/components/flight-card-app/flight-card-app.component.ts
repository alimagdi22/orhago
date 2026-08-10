import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BAGGAGE_INFORMATION_DEFAULT, FLIGHT_DTO_DEFAULT, FlightResultService, FlightSearchService, IAirItinerary, IBaggageInformation, IFlightDTO } from 'rp-travel-ui';
import { SharedService } from '../../../../../shared/shared.service';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  standalone: false,
  selector: 'app-flight-card-app',
  templateUrl: './flight-card-app.component.html',
  styleUrl: './flight-card-app.component.scss',
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
export class FlightCardAppComponent {
@Input() airItineraries: IAirItinerary[] = [];
@Input() totalDuration = 0;
  @Input() baggageInfo: IBaggageInformation = BAGGAGE_INFORMATION_DEFAULT;



  sharedService = inject(SharedService);
  translate = inject(TranslateService);
  flightSearchService = inject(FlightSearchService);
  flightResultService = inject(FlightResultService);

  showMoreFlights = false;

  showFlightDetails(airItinerary: IAirItinerary, e: Event) {
    e.stopPropagation();
    this.sharedService.showFlightDetailsApp(airItinerary);
  }

}
