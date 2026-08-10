import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
})
export class ExpansionPanelComponent {
  @Input({ required: true }) title = '';
}
