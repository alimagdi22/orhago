import { Component, inject, OnInit } from '@angular/core';
import { HotelResultsService } from 'rp-hotels-ui';

@Component({
  standalone: false,
  selector: 'app-hotels-sort',
  templateUrl: './hotels-sort.component.html',
  styleUrl: './hotels-sort.component.scss'
})
export class HotelsSortComponent implements OnInit{
  sortedArr:Array<string>=['Cheapest','High Price','Low Rating','Popular','Recommended','Free Cancelation']
  hotelResults = inject(HotelResultsService);

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
