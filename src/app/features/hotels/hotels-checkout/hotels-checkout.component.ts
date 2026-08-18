import { Subscription } from 'rxjs';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomePageService, HotelCheckoutService } from 'rp-hotels-ui';
import { IMainButton } from '../../../shared/models/flights/mainButton.model';
import { FormArray, FormGroup } from '@angular/forms';
import { SharedService } from '../../../shared/shared.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  standalone: false,
  selector: 'app-hotels-checkout',
  templateUrl: './hotels-checkout.component.html',
  styleUrl: './hotels-checkout.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),

    trigger('slideUpDown', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class HotelsCheckoutComponent implements OnInit, OnDestroy {
  private hotelCheckoutService = inject(HotelCheckoutService);
  private homeService = inject(HomePageService);
  public sharedService = inject(SharedService);
  private route = inject(ActivatedRoute);
  private subscriptions = new Subscription();

  public firstLoad = true;
  public nights = 0;
  public processToPayment: IMainButton = {
    height: '48px',
    width: '195px',
    borderRadius: '12px',
  };

  public processToPaymentMobile: IMainButton = {
    height: '48px',
    width: '296px',
    borderRadius: '8px',
    fontSize:'16px',
    padding:'5px'
  }

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    this.hotelCheckoutService.searchId = this.route.snapshot.params['sId'];
    this.hotelCheckoutService.providerId = this.route.snapshot.params['pId'];
    this.hotelCheckoutService.hotelCode = this.route.snapshot.params['hotelId'];
    this.hotelCheckoutService.packageKey = this.route.snapshot.params['package'];
    this.nights = +this.route.snapshot.params['nights'];
    let cityId = this.route.snapshot.params['cityId'];

    console.log(this.nights)

    this.hotelCheckoutService.initalCkeckoutForm(Number(cityId));
    this.hotelCheckoutService.loadDataCard(this.hotelCheckoutService.providerId, this.hotelCheckoutService.searchId, this.hotelCheckoutService.hotelCode, this.hotelCheckoutService.packageKey);

    this.subscriptions.add(
      this.hotelCheckoutService.paymentLink.subscribe((data: any)=>{
        this.sharedService.scrollToTop();
        this.sharedService.setPaymentLink(data.Link);
        this.sharedService.isIframeLoading = true;
      })
    )

    this.subscriptions.add(
      this.hotelCheckoutService.paymentLinkFailure.subscribe((err:any)=>{
        // if(err){
        //   this.errorHandle=true;
        // }
      })
    )
  }

  onSubmitHotelForm() {
    if (this.hotelCheckoutService.HotelForm.invalid) {
      for (var i = 0; i < (<FormArray>this.hotelCheckoutService.HotelForm.get('Travellers'))['controls'].length; i++) {
        if ((<FormArray>this.hotelCheckoutService.HotelForm.get('Travellers')).at(i)?.invalid) {
          if (typeof document !== 'undefined') {
            const element = document.getElementById(i.toString());

            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              element.click();
            }
          }

          // (<FormArray>this.hotelCheckoutService.HotelForm.get('Travellers')).at(i).markAllAsTouched();
          let phone: FormGroup = <FormGroup>(<FormArray>this.hotelCheckoutService.HotelForm.get('Travellers'))['controls'][0];

          this.sharedService.checkHotelPhoneNumberValidation();
          this.hotelCheckoutService.HotelForm.markAllAsTouched();
          break;
        }
      }
    } else {
      this.firstLoad = false;
      this.hotelCheckoutService.prepareData(
        this.hotelCheckoutService.RequiredHotel,
        this.homeService.selectedCurrency.Currency_Code
      )
      this.hotelCheckoutService.onSubmit('EG');
    }
  }

  get isLoading() {
    return this.hotelCheckoutService.loader;
  }

  get isIframeLoading() {
    return this.sharedService.isIframeLoading;
  }

  get showPayment() {
    return this.sharedService.showPayment;
  }

  get mySafeUrl() {
    return this.sharedService.mySafeUrl;
  }

  get hotel() {
    return this.hotelCheckoutService?.RequiredHotel;
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    this.sharedService.showPayment = false;
    // this.hotelCheckoutService.destroyer();
    this.subscriptions.unsubscribe();
  }
}
