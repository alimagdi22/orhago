import { Component, inject, Input } from '@angular/core';
import { IMainButton } from '../../../../../shared/models/flights/mainButton.model';
import { MostSearchedFlightsResponse } from '../interfaces';
import { MostSearchedFlightsService } from '../most-searched-flights.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-deals-card',
  templateUrl: './flight-deals-card.component.html',
  styleUrl: './flight-deals-card.component.scss',
})
export class FlightDealsCardComponent {
  @Input({ required: true }) mostSearchedFlight!: MostSearchedFlightsResponse;

  mostSearchedFlightsService = inject(MostSearchedFlightsService);
  translate = inject(TranslateService);

  bookButton: IMainButton = {
    borderRadius: '12px',
    height: "30px",
    fontSize: "14px",
    width: "120px"
  }

}
