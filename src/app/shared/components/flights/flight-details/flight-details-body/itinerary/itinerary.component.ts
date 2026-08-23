import { Component, inject } from '@angular/core';
import { SharedService } from '../../../../../shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrl: './itinerary.component.scss',
})
export class ItineraryComponent {
  sharedService = inject(SharedService);
  translate = inject(TranslateService);
  
  cabinClass = '';
  flightType = '';

  ngOnInit(): void {
    const flightItinerary = this.sharedService.selectedFlightItinerary;

    this.cabinClass = flightItinerary.cabinClass;
    this.flightType = this.sharedService.flightType ?? '';
    console.log(this.sharedService.selectedFlightItinerary,'iten');
    
    console.log(this.cabinClass , 'cabin parent ');
    
  }

  getNumberOfStops(numberOfStops: number) {
    switch (numberOfStops) {
      case 1:
        return 'One Stop';
      case 2:
        return 'Two Stops';
      case 3:
        return 'Three Stops';
      case 4:
        return 'Four Stops';
      default:
        return 'Non-Stops';
    }
  }

  getDayDiffBetweenSegments(segment1Arrival: string, segment2Departure: string): number {
  const arrival = new Date(segment1Arrival);
  const departure = new Date(segment2Departure);

  const arrivalMidnight = new Date(arrival.getFullYear(), arrival.getMonth(), arrival.getDate());
  const departureMidnight = new Date(departure.getFullYear(), departure.getMonth(), departure.getDate());

  const diffInMs = departureMidnight.getTime() - arrivalMidnight.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
}

}
