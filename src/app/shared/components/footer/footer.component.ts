import { Component, inject } from '@angular/core';
import { SharedService } from '../../shared.service';

@Component({
  standalone: false,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  sharedService = inject(SharedService);

  onNavigate() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
