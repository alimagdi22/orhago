import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { hotel, HotelResultsService } from 'rp-hotels-ui';
import { IMainButton } from '../../../../../shared/models/flights/mainButton.model';
import { SharedService } from '../../../../../shared/shared.service';

@Component({
  standalone: false,
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrl: './hotel-card.component.scss'
})
export class HotelCardComponent implements OnInit {
  @Input({ required: false }) hotel!: hotel;

  private hotelResultsService = inject(HotelResultsService);
  public sharedService = inject(SharedService);
  private route = inject(ActivatedRoute);
  
  public stars: number[] = [];
  public translate = inject(TranslateService);
  public viewDealButton: IMainButton = {
    borderRadius: '12px',
    height: '36px',
    width: '100%'
  }

  ngOnInit(): void {
    if (this.hotel) {
      for(let i = 0; i < this.hotel.hotelStars; i++) this.stars.push(1);
    }
  }

  onClickViewDeal() {
    let cityId = this.route.snapshot.params['locationId'];
    let hotelId = this.hotel.hotelCode;
    let searchId = this.hotelResultsService.searchID;
    let providerId = this.hotel.providerID;
    let currency = this.hotel.costCurrency;
    let nightsNum = this.hotelResultsService.nightsNumber;

    this.sharedService.router.navigate(['hotels-rooms'], {
      queryParams: {
        searchId,
        cityId,
        hotelId,
        providerId,
        currency,
        nightsNum
      }
    }).then(() => {
      this.sharedService.scrollToTop();
    });
  }
}
