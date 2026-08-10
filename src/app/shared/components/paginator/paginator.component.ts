import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { generateArray } from '../../utils/generateArray';
import { takeWhile } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent implements OnChanges {
  @Input({ required: true }) numberOfPages = 0;
  @Input({ required: true }) currentPage = 0;

  @Output() nextPageClicked = new EventEmitter<null>();
  @Output() previousPageClicked = new EventEmitter<null>();
  @Output() pageClicked = new EventEmitter<number>();

  pages: number[] = [];

  ngOnChanges(): void {
    this.pages = generateArray(this.numberOfPages);
    this.numberOfPages = Math.ceil(this.numberOfPages);
  }
}
