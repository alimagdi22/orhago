import { Component, inject, Input, output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-input-header-app',
  templateUrl: './input-header-app.component.html',
  styleUrl: './input-header-app.component.scss'
})
export class InputHeaderAppComponent {
@Input({ required: true }) headerTitle = '';
  onClickClose = output<void>();
      translate = inject(TranslateService)

}
