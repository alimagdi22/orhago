import { Component, inject } from '@angular/core';
import { SharedService } from '../../shared.service';
import { IMainButton } from '../../models/flights/mainButton.model';

@Component({
  standalone: false,
  selector: 'app-error-sheet',
  templateUrl: './error-sheet.component.html',
  styleUrl: './error-sheet.component.scss',
})
export class ErrorSheetComponent {
  sharedService = inject(SharedService);

  okayButtonInfo: IMainButton = {
    height: '48px',
    width: '150px',
    borderRadius: '12px',
  };
}
