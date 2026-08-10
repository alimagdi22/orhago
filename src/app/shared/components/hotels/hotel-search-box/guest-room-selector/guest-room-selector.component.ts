import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { HotelSearchService } from 'rp-hotels-ui';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MobileGuestRoomSelectorComponent } from './mobile-guest-room-selector/mobile-guest-room-selector.component';

@Component({
  standalone: false,
  selector: 'app-guest-room-selector',
  templateUrl: './guest-room-selector.component.html',
  styleUrls: ['./guest-room-selector.component.scss']
})
export class GuestRoomSelectorComponent implements OnInit {
  childAges = Array.from({ length: 10 }, (_, i) => i + 1);

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  translate = inject(TranslateService);
  public dialog = inject(MatDialog)

  constructor(public hotelSearchService: HotelSearchService) {}

  ngOnInit() {
    this.initializeGuestData();
  }

  private initializeGuestData() {
    const cachedData = (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('hotelSearchFormData') : null);

    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);

        if (parsedData?.guestInfo && Array.isArray(parsedData.guestInfo)) {
          // Clear any existing rooms
          while (this.guestInfo.length > 0) {
            this.hotelSearchService.removeRoomAtIndex(0);
          }

          // Add rooms from cached data
          parsedData.guestInfo.forEach((room: any) => {
            const newRoomIndex = this.guestInfo.length;
            this.hotelSearchService.addRoom();

            // Set adults and children
            const roomForm = this.guestInfo.at(newRoomIndex) as FormGroup;
            roomForm.get('adult')?.setValue(room.adult);
            roomForm.get('child')?.setValue(room.child);

            // Initialize childGroup form control if it doesn't exist
            if (!roomForm.get('childGroup')) {
              roomForm.addControl('childGroup', new FormControl([]));
            }

            // Set child ages if they exist
            if (room.childGroup && Array.isArray(room.childGroup)) {
              const childAges = room.childGroup.map((age: string) => parseInt(age, 10));

              // Update both service and form control
              this.hotelSearchService.roomChildAgeArray[newRoomIndex].childs = childAges;
              roomForm.get('childGroup')?.setValue(childAges);
            } else if (room.child > 0) {
              // Initialize with default ages if children exist but no ages in cache
              const defaultAges = Array(room.child).fill(0);
              this.hotelSearchService.roomChildAgeArray[newRoomIndex].childs = defaultAges;
              roomForm.get('childGroup')?.setValue(defaultAges);
            }
          });
          return;
        }
      } catch (e) {
        console.error('Error parsing cached guest data:', e);
      }
    }

    // If no cached data or error, set default values
    if (this.guestInfo.length === 0) {
      this.addRoomWithDefaults();
    }
  }

  private addRoomWithDefaults() {
    this.hotelSearchService.addRoom();
    const firstRoom = this.guestInfo.at(0) as FormGroup;
    firstRoom.get('adult')?.setValue(1);
    firstRoom.get('child')?.setValue(0);

    // Ensure childGroup control exists
    if (!firstRoom.get('childGroup')) {
      firstRoom.addControl('childGroup', new FormControl([]));
    }
  }

  onSelectorClick(event: MouseEvent) {
    if (this.isMobileDevice()) {
      event.stopPropagation();
      event.preventDefault();
      this.openMobileDialog();
    }
  }

  isMobileDevice(): boolean {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  openMobileDialog(): void {
    this.dialog.open(MobileGuestRoomSelectorComponent, {
      width: '100%',
      maxWidth: '100vw',
      height: '100%',
      panelClass: 'full-screen-dialog',
      data: {
        guestInfo: this.guestInfo.value
      }
    });
  }

  get guestInfo(): FormArray {
    return this.hotelSearchService.GuestData;
  }

  get summaryText(): string {
    const cached = (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('hotelSearchFormData') : null);
    const liveData = this.guestInfo.value;

    let useCache = false;
    let cachedGuestInfo: any[] = [];

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed?.guestInfo)) {
          cachedGuestInfo = parsed.guestInfo;

          // Compare cached guestInfo with current form guestInfo
          const liveJson = JSON.stringify(liveData);
          const cacheJson = JSON.stringify(cachedGuestInfo);
          useCache = liveJson === cacheJson;
        }
      } catch (e) {
        console.error('Error parsing cached data in summaryText:', e);
      }
    }

    let totalAdults = 0;
    let totalChildren = 0;
    let rooms = 0;

    const source = useCache ? cachedGuestInfo : liveData;
    for (const room of source) {
      totalAdults += +room.adult;
      totalChildren += +room.child;
    }

    const totalGuests = totalAdults + totalChildren;
    rooms = source.length;

    const guestText = this.translate.instant(
      totalGuests === 1 ? 'searchBox.guest' : 'searchBox.guests'
    );
    const roomText = this.translate.instant(
      rooms === 1 ? 'searchBox.room' : 'searchBox.rooms'
    );

    return `${totalGuests} ${guestText} ${rooms} ${roomText}`;
  }

  addRoom() {
    this.hotelSearchService.addRoom();
  }

  removeRoom(index: number) {
    this.hotelSearchService.removeRoomAtIndex(index);
  }

  incrementAdult(index: number) {
    const room = this.guestInfo.at(index) as FormGroup;
    const current = room.get('adult')?.value;

    if (current < 6) {
      room.get('adult')?.setValue(current + 1);
      this.hotelSearchService.guestNumberValidation();
    }
  }

  decrementAdult(index: number) {
    const room = this.guestInfo.at(index) as FormGroup;
    const current = room.get('adult')?.value;

    if (current > 1) {
      room.get('adult')?.setValue(current - 1);
      this.hotelSearchService.guestNumberValidation();
    }
  }

  incrementChild(index: number) {
    const room = this.guestInfo.at(index) as FormGroup;
    const current = room.get('child')?.value;

    if (current < 2) {
      room.get('child')?.setValue(current + 1);
      this.addChildAgePlaceholder(index);
      this.hotelSearchService.guestNumberValidation();
    }
  }

  decrementChild(index: number) {
    const room = this.guestInfo.at(index) as FormGroup;
    const current = room.get('child')?.value;

    if (current > 0) {
      room.get('child')?.setValue(current - 1);
      this.removeChildAge(index);
      this.hotelSearchService.guestNumberValidation();
    }
  }

  private addChildAgePlaceholder(roomIndex: number) {
    const roomAges = this.hotelSearchService.roomChildAgeArray[roomIndex].childs;
    roomAges.push(0); // Default age
    this.updateFormChildGroup(roomIndex);
  }

  private removeChildAge(roomIndex: number) {
    const roomAges = this.hotelSearchService.roomChildAgeArray[roomIndex].childs;
    roomAges.pop();
    this.updateFormChildGroup(roomIndex);
  }

  private updateFormChildGroup(roomIndex: number) {
    const room = this.guestInfo.at(roomIndex) as FormGroup;
    room.get('childGroup')?.setValue(
      [...this.hotelSearchService.roomChildAgeArray[roomIndex].childs]
    );
  }

  updateChildAge(roomIndex: number, childIndex: number, age: number) {
    this.hotelSearchService.roomChildAgeArray[roomIndex].childs[childIndex] = age;
    this.updateFormChildGroup(roomIndex);
  }

  getChildAge(roomIndex: number, childIndex: number): number {
    return this.hotelSearchService.roomChildAgeArray[roomIndex]?.childs[childIndex] || 0;
  }

  // Prevent menu from closing when interacting with its content
  handleMenuClick(event: Event) {
    event.stopPropagation();
  }
}
