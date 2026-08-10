import { Component, inject } from '@angular/core';
import { HotelResultsService } from 'rp-hotels-ui';

@Component({
  standalone: false,
  selector: 'app-hotels-sort-app',
  templateUrl: './hotels-sort-app.component.html',
  styleUrl: './hotels-sort-app.component.scss'
})
export class HotelsSortAppComponent {
  sortedArr:Array<string>=['Cheapest','High Price','Low Rating','Popular','Recommended','Free Cancelation']
  hotelResults = inject(HotelResultsService);
    public isSidebarOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  filteredSortedArr: Array<string> = [];
  originalIndices: Array<number> = [];
  ngOnInit(): void {
    this.filteredSortedArr = this.sortedArr
    .map((item, index) => ({ item, index }))
    .filter(({ index }) =>index !== 0 &&  index !== 1 && index !== 2 && index !==3)
    .map(({ item }) => item);

  this.originalIndices = this.sortedArr
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => index !== 0 && index !== 1 && index !== 2 && index !==3)
    .map(({ index }) => index);
  }
}
