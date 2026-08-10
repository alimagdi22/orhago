import { Component, Input, OnInit } from '@angular/core';
import { SORT_ITEM_DEFAULT } from '../../../constants/defaultValuse';
import { ISortItem } from '../../../models/sortItem.model';

@Component({
  standalone: false,
  selector: 'app-sort-item',
  templateUrl: './sort-item.component.html',
  styleUrl: './sort-item.component.scss',
})
export class SortItemComponent {
  @Input({ required: true }) sortItem: ISortItem = SORT_ITEM_DEFAULT;
}
