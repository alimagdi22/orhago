import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-side-nav-content',
  templateUrl: './side-nav-content.component.html',
  styleUrls: ['./side-nav-content.component.scss'],
})
export class SideNavContentComponent {
  alertTrigger = false;
}
