import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { ContactUsComponent } from './features/contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './features/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './features/terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'flight-results',
    loadChildren: () =>
      import('./features/flights/flight-results/flight-results.module').then((m) => m.FlightResultsModule),
  },
  {
    path: 'flight-checkout',
    loadChildren: () =>
      import('./features/flights/flight-checkout/flight-checkout.module').then((m) => m.FlightCheckoutModule),
  },
  {
    path: 'paymentresult',
    loadChildren: () =>
      import('./features/flights/flight-confirmation/flight-confirmation.module').then(
        (m) => m.FlightConfirmationModule,
      ),
  },
  {
    path: 'user-management',
    loadChildren: () => import('./features/user-management/user-management.module').then((m) => m.UserManagementModule),
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
  },
  { path: 'hotels-results', loadChildren: () => import('./features/hotels/hotels-results/hotels-results.module').then(m => m.HotelsResultsModule) },
  { path: 'hotels-rooms', loadChildren: () => import('./features/hotels/hotels-rooms/hotels-rooms.module').then(m => m.HotelsRoomsModule) },
  { path: 'hotels-checkout', loadChildren: () => import('./features/hotels/hotels-checkout/hotels-checkout.module').then(m => m.HotelsCheckoutModule) },
  { path: 'paymentresult/hotel', loadChildren: () => import('./features/hotels/hotels-confirmation/hotels-confirmation.module').then(m => m.HotelsConfirmationModule) },
  // Alias routes for /flights and /hotels (used by search box header tab detection)
  { path: 'flights', loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule) },
  { path: 'hotels', loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule) },
  // Wildcard: redirect unknown paths to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule],
  providers: [DatePipe, HttpClient],
})
export class AppRoutingModule {}
