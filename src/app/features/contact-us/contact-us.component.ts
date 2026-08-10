import { Component } from '@angular/core';
import { IMainButton } from '../../shared/models/flights/mainButton.model';
import { SharedModule } from '../../shared/shared.module';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  sendButton: IMainButton = {
    height: '45px',
    width: '160px',
    borderRadius: '12px',
  };
}
