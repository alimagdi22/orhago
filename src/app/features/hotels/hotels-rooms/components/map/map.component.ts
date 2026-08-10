import { Component, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  standalone: false,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  host: {
    class: 'row'
  }
})
export class MapComponent {
  @Input({ required: true }) location?: SafeResourceUrl;
}
