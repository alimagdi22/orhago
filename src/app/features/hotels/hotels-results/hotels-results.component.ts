import { DatePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GetHotelModule } from 'rp-hotels-ui';
import { HotelRoomsService } from 'rp-hotels-ui';
import { HotelResultsService } from 'rp-hotels-ui';
import { SharedService } from '../../../shared/shared.service';
import { HotelsTagsComponent } from './components/hotels-tags/hotels-tags.component';
import { IMainButton } from '../../../shared/models/flights/mainButton.model';

@Component({
  standalone: false,
  selector: 'app-hotels-results',
  templateUrl: './hotels-results.component.html',
  styleUrl: './hotels-results.component.scss',
  providers: [
    DatePipe
  ]
})
export class HotelsResultsComponent {
  @ViewChild(HotelsTagsComponent) hotelsTagsComponent!: HotelsTagsComponent;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private datePipe = inject(DatePipe);
  private timeoutId: any;

  public translate = inject(TranslateService);
  public sharedService = inject(SharedService);
  public hotelRoomsService = inject(HotelRoomsService);
  public hotelResultsService = inject(HotelResultsService);
  public isSearchVisible = false;
  public isSidebarOpen = false;
  public loadMoreDataButton: IMainButton = {
    width: '100%',
    height: '48px',
    borderRadius: '12px'
  }

  ngOnInit(){
    this.hotelRoomsService.destroyer();

    this.route.params.subscribe({
      next: () => {
        let hotelUrlParams = this.router.url.split('/');
        let guestInfo = hotelUrlParams[13];
        let searchRooms = this.hotelResultsService.generateSearchRooms(guestInfo);

        let hotelSearchModel: GetHotelModule = {
          Lang: hotelUrlParams[2],
          Currency: hotelUrlParams[3],
          POS: hotelUrlParams[4],
          sID: hotelUrlParams[5],
          CityName: hotelUrlParams[6],
          Nat: hotelUrlParams[7].split(',')[1],
          DateFrom: hotelUrlParams[9].replace(new RegExp('%20','g'),' '),
          DateTo: hotelUrlParams[10].replace(new RegExp('%20','g'),' '),
          Source:'Direct',
          SearchRooms: searchRooms
        }

        let checkIn = this.datePipe.transform(hotelSearchModel.DateFrom, 'MMMM dd, y');
        let checkOut = this.datePipe.transform(hotelSearchModel.DateTo, 'MMMM dd, y');

        this.hotelResultsService.searchID = hotelSearchModel.sID;
        this.hotelResultsService.getHotelDataFromUrl(hotelSearchModel, hotelSearchModel.DateFrom, hotelSearchModel.DateTo);

        let hotelFormDate = JSON.stringify(
          {
            CityId: hotelSearchModel.CityName,
            dateFrom: checkIn,
            dateTo: checkOut
          }
        )
        sessionStorage.setItem('hotelformDate', hotelFormDate)
      }
    })
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  updateTimeoutSession() {
    this.timeoutId = setTimeout(() => {
        this.sharedService.isSessionTimeoutModalShowed = true;
    }, 1200000);
  }

  onResetFiltersFromFilterComponent() {
    this.hotelResultsService.resetHotelForm();
    this.hotelsTagsComponent?.removeAllFilters();
  }
}
