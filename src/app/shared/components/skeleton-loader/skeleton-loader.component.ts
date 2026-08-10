import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss',
})
export class SkeletonLoaderComponent {
  @Input({ required: true }) height = '';
}
