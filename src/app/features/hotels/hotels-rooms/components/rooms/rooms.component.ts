import { ChangeDetectionStrategy, Component, inject, Input, OnInit, output } from '@angular/core';
import { HotelRoomsService, HotelSearchService, packages, room, amenties } from 'rp-hotels-ui';
import { IMainButton } from '../../../../../shared/models/flights/mainButton.model';
import { MatDialog } from '@angular/material/dialog';
import { AmenitiesComponent } from './amenities/amenities.component';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../../shared/shared.service';

@Component({
  standalone: false,
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
  host: {
    class: "row",
    style: 'background-color: white; border: 1px solid #DFDFDF; border-radius: 6px; margin-bottom: 10px'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsComponent implements OnInit {
  @Input({ required: true }) package!: packages;
  @Input({ required: true }) index = -1;
  @Input({ required: true }) currency = '';
  @Input({ required: true }) nightsNumber = 0;
  sharedService = inject(SharedService);
  selectRoom = output<string>();

  public bookNowButton: IMainButton = {
    height: '44px',
    width:'147px',
    borderRadius: '6px',
    fontSize:'18px',
  };
  public guests = '';
  public nights = '';

  private hotelRoomsService = inject(HotelRoomsService);
  private hotelSearchService = inject(HotelSearchService);
  private dialog = inject(MatDialog);
  private translateService = inject(TranslateService);

  ngOnInit() {
    const guests = this.hotelSearchService.HotelSearchForm.get('guestInfo')?.value as {adult: number, child: number}[];

    if(guests) {
      let guestsNumber = 0;
      const isCurrentLangEnglish = this.translateService.currentLang === 'en';

      guests.forEach(guest => {
        guestsNumber += (guest.adult + guest.child);
      })

      this.guests = guestsNumber > 1 ?
      `${guestsNumber} ${isCurrentLangEnglish ? 'Guests' : 'ضيوف'}` :
      `${guestsNumber} ${isCurrentLangEnglish ? 'Guest' : 'ضيف'}`;

      this.nights = this.nightsNumber > 1 ?
      `${this.nightsNumber} ${isCurrentLangEnglish ? 'Nights' : 'ليالي'}` :
      `${this.nightsNumber} ${isCurrentLangEnglish ? 'Night' : 'ليله'}`;
    }
  }

  onSelectRoom(packageKey: string | number) {
    if (packageKey !== undefined && packageKey !== null) {
      this.selectRoom.emit(packageKey.toString());
    }
  }

  showAllAmenities(amenties: amenties[]) {
    this.dialog.open(AmenitiesComponent, {
      data: {
        dismiss: () => this.dialog.closeAll(),
        amenties
      },
      width: '50vw',
      height: '80vh',
      minWidth: '350px'
    });
  }

  get amenities() {
    return this.hotelRoomsService.roomsData.Amenities;
  }
}
