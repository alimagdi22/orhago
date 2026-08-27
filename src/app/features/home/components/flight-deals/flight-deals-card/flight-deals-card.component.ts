import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
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
export class FlightDealsCardComponent implements OnInit, OnChanges {
  @Input({ required: true }) mostSearchedFlight!: MostSearchedFlightsResponse;

  mostSearchedFlightsService = inject(MostSearchedFlightsService);
  translate = inject(TranslateService);

  defaultImage = 'assets/images/popular/Dubai.png';
  displayImage = 'assets/images/popular/Dubai.png';

  bookButton: IMainButton = {
    borderRadius: '6px',
    height: '30px',
    fontSize: '14px',
    width: '120px',
    backgroundColor: '#213567',
    color:'white'
  };

  ngOnInit(): void {
    this.updateImage();
  }

  ngOnChanges(): void {
    this.updateImage();
  }

  updateImage(): void {
    const airport = this.mostSearchedFlight?.cheapestAirItinerary?.allJourney?.flights?.[0]?.flightDTO?.[0]
      ?.arrivalTerminalAirport as any;
    const cityImage = airport?.en?.cityImage || airport?.cityImage;

    if (!cityImage || typeof cityImage !== 'string' || cityImage.includes('stagingimages.round-pixel.net')) {
      this.displayImage = this.defaultImage;
    } else {
      this.displayImage = cityImage;
    }
  }

  onImgError(): void {
    this.displayImage = this.defaultImage;
  }
}
