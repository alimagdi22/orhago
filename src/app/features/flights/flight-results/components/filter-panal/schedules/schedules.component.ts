import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FlightResultService, IFlight } from 'rp-travel-ui';
import { IScheduleOption } from '../../../models/scheduleOption.model';

type flightType = 'goingFlightScheduleDepart' | 'returnFlightScheduleDepart' | 'goingFlightScheduleArrival' | 'returnFlightScheduleArrival';
@Component({
  standalone: false,
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss',
})
export class SchedulesComponent implements OnInit {
  @Input({ required: true }) isReturn = false;
  @Input({ required: true }) flights: IFlight[] = [];
  
  flightResultService = inject(FlightResultService);
  translateService = inject(TranslateService);
  flightTypeIndex = 0;
  
  goingFlight: [depart: 'goingFlightScheduleDepart', arrival: 'goingFlightScheduleArrival'] = ['goingFlightScheduleDepart', 'goingFlightScheduleArrival']

  returnFlight: [depart: 'returnFlightScheduleDepart', arrival: 'returnFlightScheduleArrival'] = ['returnFlightScheduleDepart', 'returnFlightScheduleArrival']

  departCity = '';
  arrivalCity = '';

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
    if (this.flights && this.flights.length) {
      const flightIndex = this.isReturn ? 1 : 0;
      const flight = this.flights[flightIndex];
      if (flight && flight.flightDTO && flight.flightDTO.length) {
        this.departCity = flight.flightDTO[0]?.departureTerminalAirport?.cityName || '';
        this.arrivalCity = flight.flightDTO[flight.flightDTO.length - 1]?.arrivalTerminalAirport?.cityName || '';
      }
    }

    const initialScheduleFilter = this.flightResultService.filterForm.get(
      this.isReturn ? this.returnFlight[0] : this.goingFlight[0]
    );
    this.scheduleOptions.forEach((e) => {
      e.isActive = initialScheduleFilter?.get('startTime')?.value === e.startTime;
    });
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

    const scheduleFilter = this.flightResultService.filterForm.get(
      this.isReturn ? this.returnFlight[this.flightTypeIndex] : this.goingFlight[this.flightTypeIndex]
    );

    this.scheduleOptions.forEach((e) => {
      e.isActive = scheduleFilter?.get('startTime')?.value === e.startTime;
    });
  }
}
