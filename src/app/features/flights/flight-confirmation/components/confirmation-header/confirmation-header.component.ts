import { Component } from '@angular/core';
import { IMainButton } from '../../../../../shared/models/flights/mainButton.model';

@Component({
  standalone: false,
  selector: 'app-confirmation-header',
  templateUrl: './confirmation-header.component.html',
  styleUrl: './confirmation-header.component.scss',
})
export class ConfirmationHeaderComponent {
  printButton: IMainButton = {
    height: '42px',
    width: 'none',
    borderRadius: '12px',
  };

  sendMailButton: IMainButton = {
    height: '42px',
    width: 'none',
    borderRadius: '12px',
  };

  onPrintTicket(): void {
    // Logic for printing the ticket
  }

  onSendMail(): void {
    // Logic for sending the ticket via email
  }
}
