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
}
