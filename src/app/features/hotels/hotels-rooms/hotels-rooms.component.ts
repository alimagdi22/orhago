import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotelResultsService, HotelRoomsService, HotelSearchService, packages } from 'rp-hotels-ui';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared/shared.service';
import { IMainButton } from '../../../shared/models/flights/mainButton.model';

@Component({
  standalone: false,
  selector: 'app-hotels-rooms',
  templateUrl: './hotels-rooms.component.html',
  styleUrl: './hotels-rooms.component.scss'
})
export class HotelsRoomsComponent implements OnInit, OnDestroy {
  public sharedService = inject(SharedService);
  public hotelSearchService = inject(HotelSearchService);
  public hotelRoomsService = inject(HotelRoomsService);
  private hotelResultsService = inject(HotelResultsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public isSearchVisible = false;
  public currency = "";
  public nightsNum = 0;
  public location?: SafeResourceUrl;
  public activeLink = { id: 1, title: 'Rooms' };
  public links = [
    { id: 1, title: 'Rooms' },
    { id: 4, title: 'Map' },
    { id: 5, title: 'Details' },
  ];

  public goHomeButtonInfo: IMainButton = {
    width: '200px',
    height: '48px',
    borderRadius: '8px'
  };

  private subscription = new Subscription();

  private searchId = "";
  private hotelId = "";
  private providerId = "";
  private cityId = "";
  private packageKey = "";

  // Custom popup state
  public isPopupOpen = false;

  ngOnInit() {
    this.hotelResultsService.destroyer();

    this.subscription.add(
      this.route.queryParams.subscribe((params: Params) => {
        this.searchId = params['searchId'];
        this.hotelId = params['hotelId'];
        this.providerId = params['providerId'];
        this.currency = params['currency'];
        this.nightsNum = +params['nightsNum'];
        this.cityId = params['cityId'];
        this.packageKey = params['packageKey'];

        if (this.searchId && this.hotelId && this.providerId) {
          this.hotelRoomsService
            .getRooms(this.searchId, this.hotelId, this.providerId, this.packageKey)
            .subscribe({
              next: () => {
                this.updateLocation();
              },
              error: (err) => console.error('get hotel rooms error ->', err)
            });
        }
      })
    );
  }

  private updateLocation() {
    const data = this.hotelRoomsService.roomsData;
    if (!data) {
      this.location = undefined;
      return;
    }

    let query = '';
    const lat = data.Lat;
    const lng = data.Lng;

    if (lat && lng && String(lat).trim() !== '' && String(lng).trim() !== '' && String(lat) !== '0' && String(lng) !== '0') {
      query = `${lat},${lng}`;
    } else if (data.Address && String(data.Address).trim() !== '') {
      query = `${data.Address}, ${data.City || ''}, ${data.Country || ''}`;
    } else if (data.hotelName && String(data.hotelName).trim() !== '') {
      query = `${data.hotelName}, ${data.City || ''}, ${data.Country || ''}`;
    } else {
      this.location = undefined;
      return;
    }

    const url = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    this.location = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goToCheckout(packageid: string) {
    this.closePopup();
    this.router.navigate([
      'hotels-checkout',
      this.providerId,
      this.searchId,
      this.hotelId,
      1,
      packageid,
      this.cityId,
      this.nightsNum
    ]).then(() => this.sharedService.scrollToTop());
  }

  get packages(): packages[] {
    return this.hotelRoomsService.roomsData?.Packages || [];
  }

  get groupedRooms() {
    return this.hotelRoomsService.groupedRooms;
  }

  get loader() {
    return this.hotelRoomsService.roomsLoader;
  }

  get checkInDate() {
    return this.hotelSearchService.HotelSearchForm.get('checkIn')?.value;
  }

  get checkOutDate() {
    return this.hotelSearchService.HotelSearchForm.get('checkOut')?.value;
  }

  openPopup() {
    this.isPopupOpen = true;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closePopup() {
    this.isPopupOpen = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    this.subscription.unsubscribe();
  }
}
