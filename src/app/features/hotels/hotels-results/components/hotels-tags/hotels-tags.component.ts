import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { HotelResultsService } from 'rp-hotels-ui';

@Component({
  standalone: false,
  selector: 'app-hotels-tags',
  templateUrl: './hotels-tags.component.html',
  styleUrl: './hotels-tags.component.scss'
})
export class HotelsTagsComponent implements OnInit{

  @Output() clearFilters = new EventEmitter<void>();
  public hotelResults = inject(HotelResultsService);
  selectedTags: string[] = [];


  ngOnInit(): void {

    this.hotelResults.selectedInclusions$.subscribe(inclusions => {
      this.selectedTags = inclusions;
    });
  }

  /**
   * Removes the given tag from the list of selected tags.
   * If the tag is no longer selected, it will be removed from the form's inclusions value.
   * If the selected tags list is empty, it will reset the filteredHotels to the original hotelDataResponse.
   * @param tag the tag to be removed
   */
  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    this.hotelResults.selectedInclusionsSubject.next(this.selectedTags);
    if (this.hotelResults.filterForm?.get('inclusions')) {
      const index = this.hotelResults.InclusionsArray.indexOf(tag);
      if (index !== -1) {
        const currentValues = this.hotelResults.filterForm.value.inclusions || [];
        const updatedValues = currentValues.map((checked: boolean, i: number) => (i === index ? false : checked));
        this.hotelResults.filterForm.get('inclusions')?.patchValue(updatedValues);
      }
    }
    if (this.selectedTags.length === 0) {
      this.hotelResults.filteredHotels = [...(this.hotelResults.hotelDataResponse?.HotelResult || [])];
    }
  }

  /**
 * Clears all selected filters and resets the hotel search results.
 *
 * This method performs the following actions:
 * 1. Clears the `selectedTags` array to remove all selected filter tags.
 * 2. Updates the `selectedInclusionsSubject` to notify subscribers that no tags are selected.
 * 3. Resets the 'inclusions' form controls to unchecked if they exist.
 * 4. Resets the `filteredHotels` to the full list of hotels from the `hotelDataResponse`.
 */
  public removeAllFilters() {
    this.selectedTags = [];
    this.hotelResults.selectedInclusionsSubject.next([]);
    if (this.hotelResults.filterForm?.get('inclusions')) {
      const uncheckedValues = this.hotelResults.InclusionsArray.map(() => false);
      this.hotelResults.filterForm.get('inclusions')?.patchValue(uncheckedValues);
    }
    this.hotelResults.filteredHotels = [...(this.hotelResults.hotelDataResponse?.HotelResult || [])];

      if (this.selectedTags.length === 0) {
      this.clearFilters.emit();
    }
  }
}
