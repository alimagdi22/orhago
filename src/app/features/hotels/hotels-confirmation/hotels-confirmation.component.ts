import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelConfirmationService } from 'rp-hotels-ui';
import { IMainButton } from '../../../shared/models/flights/mainButton.model';

@Component({
  standalone: false,
  selector: 'app-hotels-confirmation',
  templateUrl: './hotels-confirmation.component.html',
  styleUrl: './hotels-confirmation.component.scss',
  host: {
    class: 'container',
    style: `
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; 
      background-color: #FAFAFA; 
      border-radius: 12px; 
      display: block;
      margin-block: 60px;
    `
  }
})
export class HotelsConfirmationComponent implements OnInit {
  private hotelConfrimationService = inject(HotelConfirmationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public contactButton: IMainButton = {
    height: '42px',
    width: 'none',
    borderRadius: '12px',
  };

  public printButton: IMainButton = {
    height: '42px',
    width: 'none',
    borderRadius: '12px',
  };

  public sendMailButton: IMainButton = {
    height: '42px',
    width: 'none',
    borderRadius: '12px',
  };

  /**
   * 1- Add Type to getHotelsPaymentResult API
   */

  ngOnInit(): void {
    const hgNum = this.route.snapshot.queryParams['HG'] as string || '';
    const searchId = this.route.snapshot.queryParams['sid'] as string || '';
    const token = this.route.snapshot.queryParams['tok'] as string || '';

    let url = this.router.url;
    let i = url.indexOf('?') + 1
    url = url.slice(i);

    if(hgNum && searchId && token && url) {
      this.hotelConfrimationService.getConfirmationData(url, searchId, hgNum, token);
    } else {
      this.hotelConfrimationService.error = true;
    }
  }

  onContactUs() {
    this.router.navigate(['contact-us']);
  }

  onPrintTicket(): void {
    // Logic for printing the ticket
  }

  onSendMail(): void {
    // Logic for sending the ticket via email
  }

  get error() {
    return this.hotelConfrimationService.error;
  }

  get isLoading() {
    return this.hotelConfrimationService.loading;
  }

  get confirmationData() {
    return this.hotelConfrimationService.confirmationData;
  }
}
