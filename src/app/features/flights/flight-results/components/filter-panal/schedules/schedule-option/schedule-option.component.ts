import { Component, Input } from '@angular/core';
import { IScheduleOption } from '../../../../models/scheduleOption.model';
import { SCHEDULE_OPTION_DEFAULT } from '../../../../constants/defaultValuse';

@Component({
  standalone: false,
  selector: 'app-schedule-option',
  templateUrl: './schedule-option.component.html',
  styleUrl: './schedule-option.component.scss',
})
export class ScheduleOptionComponent {
  @Input({ required: true }) scheduleOption: IScheduleOption = SCHEDULE_OPTION_DEFAULT;

  get labelKey(): string {
    switch (this.scheduleOption.title) {
      case 'Morning':
        return 'results.filter.before0600';
      case 'Noon':
        return 'results.filter.range0612';
      case 'Afternoon':
        return 'results.filter.range1218';
      default:
        return 'results.filter.after1800';
    }
  }
}
