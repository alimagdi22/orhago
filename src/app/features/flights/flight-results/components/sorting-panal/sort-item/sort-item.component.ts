import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
  private translate = inject(TranslateService);

  get durationLabel(): string {
    const total = Number(this.sortItem.duration) || 0;
    const hours = Math.floor(total / 60);
    const minutes = (total % 60).toString().padStart(2, '0');
    if (this.translate.currentLang === 'ar') {
      return `${hours}س ${minutes}د`;
    }
    return `${hours}h ${minutes}m`;
  }
}
