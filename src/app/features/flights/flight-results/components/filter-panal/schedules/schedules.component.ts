import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FlightResultService, IFlight } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { IScheduleOption } from '../../../models/scheduleOption.model';

type flightType = 'goingFlightScheduleDepart' | 'returnFlightScheduleDepart' | 'goingFlightScheduleArrival' | 'returnFlightScheduleArrival';
@Component({
  standalone: false,
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss',
})
export class SchedulesComponent implements OnInit, OnDestroy {
  @Input({ required: true }) isReturn = false;
  @Input({ required: true }) flights: IFlight[] = [];
  
  flightResultService = inject(FlightResultService);
  flightTypeIndex = 0;
  private subscription = new Subscription();
  
  goingFlight: [depart: 'goingFlightScheduleDepart', arrival: 'goingFlightScheduleArrival'] = ['goingFlightScheduleDepart', 'goingFlightScheduleArrival']

  returnFlight: [depart: 'returnFlightScheduleDepart', arrival: 'returnFlightScheduleArrival'] = ['returnFlightScheduleDepart', 'returnFlightScheduleArrival']

  scheduleOptions: IScheduleOption[] = [
    {
      icon: 'sun-rise-icon.svg',
      title: 'Morning',
      startTime: '00:00',
      endTime: '05:59',
      isActive: false,
    },
    {
      icon: 'sun-icon.svg',
      title: 'Noon',
      startTime: '06:00',
      endTime: '11:59',
      isActive: false,
    },
    {
      icon: 'sun-down-icon.svg',
      title: 'Afternoon',
      startTime: '12:00',
      endTime: '17:59',
      isActive: false,
    },
    {
      icon: 'solar-moon-icon.svg',
      title: 'Night',
      startTime: '18:00',
      endTime: '23:59',
      isActive: false,
    },
  ];

  ngOnInit(): void {
    this.syncActive();
    this.subscription.add(
      this.flightResultService.filterForm?.valueChanges.subscribe(() => this.syncActive())
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get originCode(): string {
    return this.airportCode(true);
  }

  get destinationCode(): string {
    return this.airportCode(false);
  }

  onSelectOption(scheduleOption: IScheduleOption) {
    this.scheduleOptions.forEach((e) => {
      e.isActive = false;
    });

    const scheduleFilter = this.flightResultService.filterForm.get(
      this.isReturn ? this.returnFlight[this.flightTypeIndex] : this.goingFlight[this.flightTypeIndex]
    );

    if (scheduleFilter?.get('startTime')?.value === scheduleOption.startTime || scheduleFilter?.get('endTime')?.value === scheduleOption.endTime) {
      scheduleFilter?.get('startTime')?.setValue('');
      scheduleFilter?.get('endTime')?.setValue('');
    } else {
      scheduleFilter?.get('startTime')?.setValue(scheduleOption.startTime);
      scheduleFilter?.get('endTime')?.setValue(scheduleOption.endTime);
      scheduleOption.isActive = true;
    }
  }

  onScheduleTabChange(value: number) {
    this.flightTypeIndex = value;
    this.syncActive();
  }

  private syncActive(): void {
    const scheduleFilter = this.flightResultService.filterForm?.get(
      this.isReturn ? this.returnFlight[this.flightTypeIndex] : this.goingFlight[this.flightTypeIndex]
    );
    this.scheduleOptions.forEach((option) => {
      option.isActive = scheduleFilter?.get('startTime')?.value === option.startTime;
    });
  }

  private airportCode(departing: boolean): string {
    const flight = this.flights?.[this.isReturn ? 1 : 0];
    const legs = flight?.flightDTO;
    if (!legs?.length) {
      return '';
    }

    const airport = departing
      ? legs[0]?.departureTerminalAirport
      : legs[legs.length - 1]?.arrivalTerminalAirport;
    const translated = airport as { airportCode?: string; cityCode?: string; en?: { airportCode?: string; cityCode?: string } };
    return translated?.airportCode || translated?.en?.airportCode || translated?.cityCode || translated?.en?.cityCode || '';
  }
}
