import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { FlightCheckoutApiService, FlightCheckoutService, HomePageService, IAirItinerary, mergedGates } from 'rp-travel-ui';

declare var PaymentSession: any;

@Component({
  standalone: false,
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss',
})
export class PaymentMethodComponent implements OnInit, OnDestroy {
  public sharedService = inject(SharedService);
  private translateService = inject(TranslateService);
  private route = inject(ActivatedRoute);
  public flightCheckoutService = inject(FlightCheckoutService);
  private flightCheckoutApiService = inject(FlightCheckoutApiService);
  private cdRef = inject(ChangeDetectorRef);
  private router = inject(Router);
  public homePageService = inject(HomePageService);

  @Input() brandedFareId: number = 0;

  selectedTicket?: string;
  selectedFlight: any = null;
  currentLang = this.translateService.currentLang;
  paymentData$!: Observable<any>;
  selectedOption: number | null = null;
  selectedGatway!: mergedGates;
  checked = false;

  mpgsSessionId = '';
  showMPGSPayment = false;
  mpgsSessionInitialized = false;
  mpgsLoading = false;

  amount: number | undefined;
  currency: string | undefined;

  mpgsAlreadyInitialized = false;

  searchParams: any = {};

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchParams = {
        searchId: params['sid']?.split('_')[0],
        sequenceNum: params['sequenceNum'],
        providerKey: params['providerKey'] || params['pkey'],
        pcc: params['sid']?.split('_')[1],
      };

      if (this.flightCheckoutService.selectedFlight) {
        this.selectedFlight = this.flightCheckoutService.selectedFlight;
        const userCurrency = this.selectedFlight.searchCriteria?.currency || this.homePageService.selectedCurrency?.Currency_Code || 'KWD';
        const paymentLocation = this.homePageService.pointOfSale?.country || 'KW';
        this.loadPaymentData(
          userCurrency,
          paymentLocation,
          this.selectedFlight.airItineraryDTO,
        );
      }
    });
  }

  loadPaymentData(userCurrency: string, paymentLocation: string, body: IAirItinerary): void {
    this.paymentData$ = this.flightCheckoutApiService.addPaymentGateways(userCurrency, paymentLocation, body);
    this.paymentData$.subscribe({
      next: (gateways: mergedGates[]) => {
        if (gateways && gateways.length > 0 && !this.selectedGatway) {
          const defaultIndex = gateways.findIndex((g) => g.PaymentMethod?.toLowerCase() === 'PaytabsCC'.toLowerCase());
          if (defaultIndex !== -1) {
            this.selectOption(defaultIndex, gateways[defaultIndex]);
          } else {
            this.selectOption(0, gateways[0]);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching payment gateways:', err);
      }
    });
  }

  loadHostedSessionScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src*="session.js"]');
      if (existing) existing.remove();

      (window as any).PaymentSession = null;

      const script = document.createElement('script');
      script.src = 'https://test-gateway.mastercard.com/form/version/59/merchant/TestCAEMER79/session.js';

      script.onload = () => resolve();
      script.onerror = () => reject(new Error('MPGS script failed to load'));

      document.body.appendChild(script);
    });
  }

  selectOption(index: number, gateway: any): void {
    this.selectedGatway = gateway;
    this.selectedOption = index;
    this.sharedService.selectedGateway = gateway;
    if (gateway.GatewayType === 'MPGS') {
      this.amount = this.selectedFlight?.airItineraryDTO?.itinTotalFare?.amount;
      this.currency = this.selectedFlight?.airItineraryDTO?.itinTotalFare?.currencyCode;

      this.showMPGSPayment = true;

      if (this.mpgsAlreadyInitialized) {
        this.mpgsSessionInitialized = true;
        this.cdRef.detectChanges();
        return;
      }

      const gatewayAmount = this.sharedService.selectedGateway?.Amount ?? 0;

      this.loadHostedSessionScript()
        .then(() => {
          if (this.amount !== undefined) {
            this.flightCheckoutApiService
              .createMPGSSession(gateway.GatewayType, this.amount + gatewayAmount, this.currency)
              .subscribe({
                next: (sessionId: string) => {
                  this.mpgsSessionId = sessionId;
                  this.mpgsAlreadyInitialized = true;
                  this.showMPGSPayment = true;
                  this.cdRef.detectChanges();

                  setTimeout(() => {
                    this.mpgsLoading = true;
                    this.mpgsSessionInitialized = false;
                    this.initializePaymentSession();
                  }, 0);
                },
                error: (err) => {
                  console.error('Failed to create MPGS session', err);
                  this.showMPGSPayment = false;
                },
              });
          }
        })
        .catch((error) => {
          console.error('Failed to load MPGS script:', error);
        });
    } else {
      this.showMPGSPayment = false;
    }
  }

  initializePaymentSession(): void {
    if (typeof PaymentSession === 'undefined' || !PaymentSession) return;
    PaymentSession.configure({
      session: this.mpgsSessionId.replaceAll('"', ''),
      fields: {
        card: {
          number: '#card-number',
          securityCode: '#security-code',
          expiryMonth: '#expiry-month',
          expiryYear: '#expiry-year',
          nameOnCard: '#cardholder-name',
        },
      },
      frameEmbeddingMitigation: ['javascript'],
      callbacks: {
        initialized: () => {
          this.mpgsLoading = false;
          this.mpgsSessionInitialized = true;
          this.cdRef.detectChanges();
        },
        formSessionUpdate: (response: any) => {
          if (response.status !== 'ok') {
            console.error('Form session update failed', response);
          }
        },
      },
    });
  }

  submit(selectedMethod: mergedGates) {
    if (this.selectedGatway?.GatewayType === 'MPGS' && typeof PaymentSession !== 'undefined') {
      PaymentSession.updateSessionFromForm('card');
    }

    const currentCurrency = this.selectedFlight?.searchCriteria?.currency || 'KWD';
    const pcc = this.flightCheckoutService.pcc || this.searchParams.pcc || '0';

    this.flightCheckoutService.newPaymentSaveBooking(
      currentCurrency,
      'notPremium',
      pcc,
      +this.brandedFareId || 0,
      selectedMethod,
      this.mpgsSessionId ? this.mpgsSessionId.replaceAll('"', '') : '',
    );
  }

  redirectToHome() {
    this.flightCheckoutService.paymentError = false;
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.sharedService.selectedGateway = null as any;
    this.mpgsAlreadyInitialized = false;
    this.mpgsSessionInitialized = false;

    const existingIframe = document.querySelector('iframe[src*="mastercard"]');
    if (existingIframe) existingIframe.remove();

    const script = document.querySelector('script[src*="session.js"]');
    if (script) script.remove();

    (window as any).PaymentSession = null;
  }
}
