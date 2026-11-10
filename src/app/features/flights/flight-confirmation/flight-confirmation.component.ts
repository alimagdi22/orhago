import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, IFlight } from 'rp-travel-ui';
import { IMainButton } from '../../../shared/models/flights/mainButton.model';
import { SharedService } from '../../../shared/shared.service';

@Component({
  standalone: false,
  selector: 'app-flight-confirmation',
  templateUrl: './flight-confirmation.component.html',
  styleUrl: './flight-confirmation.component.scss',
})
export class FlightConfirmationComponent implements OnInit {
  public confirmationService = inject(ConfirmationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  translate = inject(TranslateService);
  sharedService = inject(SharedService);

  todayDate = new Date();
  searchButton: IMainButton = {
    height: '48px',
    width: '220px',
    borderRadius: '12px',
    backgroundColor: '#5029f4',
    color: 'white',
  };

  ngOnInit(): void {
    console.log(this.route.snapshot.queryParamMap);
    if (this.route.snapshot.queryParamMap.has('sid') && this.route.snapshot.queryParamMap.has('HG')) {
      this.confirmationService.getConfirmationDate(
        this.route.snapshot.queryParamMap.get('sid') ?? '',
        this.route.snapshot.queryParamMap.get('HG') ?? '',
        this.route.snapshot.queryParamMap.get('tok') ?? '',
      );
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  public get flights(): IFlight[] {
    return this.confirmationService.confirmationData?.airItineraries?.[0]?.allJourney?.flights ?? [];
  }

  get dateLocale(): string {
    return this.translate.currentLang === 'ar' ? 'ar-EG' : 'en-US';
  }

  get bookingEmail(): string {
    return this.confirmationService.confirmationData?.bookingEmail || '';
  }

  get bookingReference(): string {
    return this.confirmationService.confirmationData?.hgNumber || this.confirmationService.confirmationData?.pnr || '';
  }

  get baggageLabel(): string {
    const baggage = this.confirmationService.confirmationData?.airItineraries?.[0]?.baggageInformation?.[0]?.baggage;
    return baggage ? String(baggage) : '';
  }

  airlineCode(flight: IFlight): string {
    return (flight?.flightAirline?.airlineCode || '').slice(0, 2).toUpperCase();
  }

  flightMeta(flight: IFlight): string {
    const segment = flight?.flightDTO?.[0];
    const code = flight?.flightAirline?.airlineCode || '';
    const number = String(segment?.flightInfo?.flightNumber || '');
    const bare = number.toUpperCase().startsWith(code.toUpperCase()) ? number.slice(code.length).trim() : number;
    const flightNo = `${code} ${bare}`.trim();
    const equipment = segment?.flightInfo?.equipmentNumber || '';
    return [flightNo, equipment].filter(Boolean).join('  ·  ');
  }

  durationLabel(flight: IFlight): string {
    const total = Number(flight?.elapsedTime || 0);
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    return this.translate.currentLang === 'ar' ? `${hours}س ${minutes}د` : `${hours}h ${minutes}m`;
  }

  stopsLabel(flight: IFlight): string {
    const stops = Number(flight?.stopsNum || 0);
    if (!stops) return this.translate.instant('confirmation.nonStop');
    return this.translate.instant('confirmation.stops', { count: stops });
  }

  downloadTicket(): void {
    window.print();
  }

  addToCalendar(): void {
    const flight = this.flights[0];
    const depart = flight?.flightDTO?.[0];
    const arrive = flight?.flightDTO?.[flight.flightDTO.length - 1];
    if (!depart || !arrive) return;

    const start = this.toCalendarStamp(depart.departureDate);
    const end = this.toCalendarStamp(arrive.arrivalDate);
    const from = depart.departureTerminalAirport?.cityName || depart.departureTerminalAirport?.cityCode || '';
    const to = arrive.arrivalTerminalAirport?.cityName || arrive.arrivalTerminalAirport?.cityCode || '';
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${from} → ${to}`,
      `DESCRIPTION:${this.bookingReference}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const file = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.bookingReference || 'booking'}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  manageBooking(): void {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
      this.router.navigate(['/user-management/user-profile']);
      return;
    }
    this.sharedService.isLogInSheetShowed = true;
  }

  showFareDetails(): void {
    document.getElementById('fare-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private toCalendarStamp(value: string | Date): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  public get airItineraries() {
    return this.confirmationService.confirmationData.airItineraries[0];
  }
  public get passangers() {
    return this.confirmationService.confirmationData.passengersDetails;
  }
}
