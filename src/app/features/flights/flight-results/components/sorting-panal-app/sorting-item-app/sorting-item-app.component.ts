import { Component, Input } from '@angular/core';
import { ISortItem } from '../../../models/sortItem.model';
import { SORT_ITEM_DEFAULT } from '../../../constants/defaultValuse';

@Component({
  standalone: false,
  selector: 'app-sorting-item-app',
  templateUrl: './sorting-item-app.component.html',
  styleUrl: './sorting-item-app.component.scss'
})
export class SortingItemAppComponent {
  @Input({ required: true }) sortItem: ISortItem = SORT_ITEM_DEFAULT;
}
