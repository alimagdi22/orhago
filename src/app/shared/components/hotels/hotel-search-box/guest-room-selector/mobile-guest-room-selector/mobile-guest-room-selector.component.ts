import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotelSearchService } from 'rp-hotels-ui';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-mobile-guest-room-selector',
  templateUrl: './mobile-guest-room-selector.component.html',
  styleUrls: ['./mobile-guest-room-selector.component.scss']
})
export class MobileGuestRoomSelectorComponent implements OnInit {
  childAges = Array.from({ length: 10 }, (_, i) => i + 1); // Ages 1-10

  constructor(
    public hotelSearchService: HotelSearchService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<MobileGuestRoomSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeGuestData();
  }

  private initializeGuestData() {
    if (this.data?.guestInfo) {
      this.initializeFromData(this.data.guestInfo);
    } else {
      this.initializeFromLocalStorage();
    }
  }

  private initializeFromData(guestInfo: any[]) {
    while (this.guestInfo.length > 0) {
      this.hotelSearchService.removeRoomAtIndex(0);
    }

    guestInfo.forEach(room => {
      const newRoomIndex = this.guestInfo.length;
      this.hotelSearchService.addRoom();

      const roomForm = this.guestInfo.at(newRoomIndex) as FormGroup;
      roomForm.get('adult')?.setValue(room.adult);
      roomForm.get('child')?.setValue(room.child);

      if (!roomForm.get('childGroup')) {
        roomForm.addControl('childGroup', new FormControl([]));
      }

      if (room.childGroup && Array.isArray(room.childGroup)) {
        const childAges = room.childGroup.map((age: string) => parseInt(age, 10));
        this.hotelSearchService.roomChildAgeArray[newRoomIndex].childs = childAges;
        roomForm.get('childGroup')?.setValue(childAges);
      } else if (room.child > 0) {
        const defaultAges = Array(room.child).fill(0);
        this.hotelSearchService.roomChildAgeArray[newRoomIndex].childs = defaultAges;
        roomForm.get('childGroup')?.setValue(defaultAges);
      }
    });
  }

  private initializeFromLocalStorage() {
    const cachedData = (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('hotelSearchFormData') : null);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        if (parsedData?.guestInfo) {
          this.initializeFromData(parsedData.guestInfo);
          return;
        }
      } catch (e) {
        console.error('Error parsing cached data:', e);
      }
    }

    if (this.guestInfo.length === 0) {
      this.addRoomWithDefaults();
    }
  }

  private addRoomWithDefaults() {
    this.hotelSearchService.addRoom();
    const firstRoom = this.guestInfo.at(0) as FormGroup;
    firstRoom.get('adult')?.setValue(1);
    firstRoom.get('child')?.setValue(0);

    if (!firstRoom.get('childGroup')) {
      firstRoom.addControl('childGroup', new FormControl([]));
    }
  }

  get guestInfo(): FormArray {
    return this.hotelSearchService.GuestData;
  }

  get summaryText(): string {
    let totalAdults = 0;
    let totalChildren = 0;
    let rooms = 0;

    for (const room of this.guestInfo.value) {
      totalAdults += +room.adult;
      totalChildren += +room.child;
    }

    const totalGuests = totalAdults + totalChildren;
    rooms = this.guestInfo.length;

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
    roomAges.push(0);
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

  saveAndClose() {
    this.dialogRef.close(this.guestInfo.value);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
