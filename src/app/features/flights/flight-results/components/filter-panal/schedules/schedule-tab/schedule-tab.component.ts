import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-schedule-tab',
  templateUrl: './schedule-tab.component.html',
  styleUrl: './schedule-tab.component.scss',
})
export class ScheduleTabComponent {
  @Output() scheduleTabChange = new EventEmitter<number>();

  flightTypeIndex = 0;

  onSelect(flightTypeIndex: number) {
    this.flightTypeIndex = flightTypeIndex;
    this.scheduleTabChange.emit(flightTypeIndex);
  }
}
