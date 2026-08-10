import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { DeactivateGuard } from '../../shared/guards/deactivate.guard';
import { UserManagementComponent } from './user-management.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { FlightBookingComponent } from './components/flight-booking/flight-booking.component';
import { HotelsBookingComponent } from './components/hotels-booking/hotels-booking.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'user-profile',
        pathMatch: 'full',
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
      {
        path: 'flight-booking',
        component: FlightBookingComponent,
      },
      {
        path: 'hotels-booking',
        component: HotelsBookingComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
