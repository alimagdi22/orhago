import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-number-of-stops',
  templateUrl: './number-of-stops.component.html',
  styleUrl: './number-of-stops.component.scss',
})
export class NumberOfStopsComponent implements OnChanges {
  @Input() stopsNum = 1;
  stopText = '';

  ngOnChanges(changes: SimpleChanges): void {
    switch (this.stopsNum) {
      case 1:
        this.stopText = 'One Stop';
        break;
      case 2:
        this.stopText = 'Two Stops';
        break;
      case 3:
        this.stopText = 'Three Stops';
        break;
      case 4:
        this.stopText = 'Four Stops';
        break;
      default:
        this.stopText = 'Non-Stops';
    }
  }
}
