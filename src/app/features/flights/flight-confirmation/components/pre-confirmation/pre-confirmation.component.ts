import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { IMainButton } from '../../../../../shared/models/flights/mainButton.model';

@Component({
  standalone: false,
  selector: 'app-pre-confirmation',
  templateUrl: './pre-confirmation.component.html',
  styleUrl: './pre-confirmation.component.scss',
})
export class PreConfirmationComponent implements OnInit, OnDestroy {
  loading = true;
  paymentErrorStatus = false;
  searchId = '';
  hgNum = '';
  token = '';
  src = '';

  searchButton: IMainButton = {
    height: '48px',
    width: '220px',
    borderRadius: '8px',
    backgroundColor: '#213567',
    color: 'white',
  };

  private confirmation = inject(ConfirmationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private subscription = new Subscription();

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.searchId = this.route.snapshot.queryParamMap.get('sid') || '';
    this.hgNum = this.route.snapshot.queryParamMap.get('HG') || '';
    this.token = this.route.snapshot.queryParamMap.get('tok') || '';
    this.src = this.route.snapshot.queryParamMap.get('sc') || '';

    const queryIndex = this.router.url.indexOf('?') + 1;
    const query = queryIndex > 0 ? this.router.url.slice(queryIndex) : '';

    this.subscription.add(
      this.confirmation.api.getPaymentResult(query).subscribe({
        next: (result) => {
          if (result?.Status === 0) {
            const postUrl = result.paymentResult?.PostPayment;
            const hgToken = result.HGToken;

            this.subscription.add(
              this.confirmation.api.PostProcessing(hgToken, postUrl).subscribe({
                next: (processingResult) => {
                  if (processingResult?.status == 0 && this.src != 'mob') {
                    this.router.navigate(['/paymentresult/flightConfirmation'], {
                      queryParams: {
                        sid: this.searchId,
                        HG: this.hgNum,
                        tok: hgToken,
                        confCode: processingResult.ProviderConfirmation,
                      },
                    });
                    return;
                  }

                  this.fail();
                },
                error: () => this.fail(),
              }),
            );
            return;
          }

          this.fail();
        },
        error: () => this.fail(),
      }),
    );
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fail(): void {
    this.paymentErrorStatus = true;
    this.loading = false;
  }
}
