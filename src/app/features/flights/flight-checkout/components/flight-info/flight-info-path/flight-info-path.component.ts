import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-info-path',
  templateUrl: './flight-info-path.component.html',
  styleUrl: './flight-info-path.component.scss',
})
export class FlightInfoPathComponent {
  @Input() totalDuration = 0;
  @Input() transitTime = '';
  @Input() isDirect = false;
  translate = inject(TranslateService)
}
