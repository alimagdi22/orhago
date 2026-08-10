import { Component, Input, output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-input-header',
  templateUrl: './input-header.component.html',
  styleUrl: './input-header.component.scss',
})
export class InputHeaderComponent {
  @Input({ required: true }) headerTitle = '';
  onClickClose = output<void>();
}
