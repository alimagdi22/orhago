/* Imported Modules */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RpTravelUiModule } from 'rp-travel-ui';

/* Angular Material */
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbDatepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTooltipModule } from '@angular/material/tooltip';
/* Shared Components */
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { ErrorSheetComponent } from './components/error-sheet/error-sheet.component';
import { ExpansionPanelComponent } from './components/expansion-panel/expansion-panel.component';
import { BaggageDetailsComponent } from './components/flights/flight-details/flight-details-body/baggage-details/baggage-details.component';
import { FareRulesComponent } from './components/flights/flight-details/flight-details-body/fare-rules/fare-rules.component';
import { FlightDetailsBodyComponent } from './components/flights/flight-details/flight-details-body/flight-details-body.component';
import { FlightPathComponent } from './components/flights/flight-details/flight-details-body/itinerary/flight-path/flight-path.component';
import { ItineraryComponent } from './components/flights/flight-details/flight-details-body/itinerary/itinerary.component';
import { FlightDetailsHeaderComponent } from './components/flights/flight-details/flight-details-header/flight-details-header.component';
import { FlightDetailsComponent } from './components/flights/flight-details/flight-details.component';
import { FlightSearchBoxComponent } from './components/flights/flight-search-box/flight-search-box.component';
import { CabinClassComponent } from './components/flights/flight-search-box/flight-search-inputs/cabin-class/cabin-class.component';
import { FlightSearchInputsComponent } from './components/flights/flight-search-box/flight-search-inputs/flight-search-inputs.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainButtonComponent } from './components/main-button/main-button.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { SearchBoxHeaderComponent } from './components/search-box/search-box-header/search-box-header.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { SecondaryButtonComponent } from './components/secondary-button/secondary-button.component';
import { SessionTimeoutComponent } from './components/session-timeout/session-timeout.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { SpinnerLoaderComponent } from './components/spinner-loader/spinner-loader.component';
import { ForgetPasswordComponent } from './components/user-management/forget-password/forget-password.component';
import { LoginComponent } from './components/user-management/login/login.component';
import { RegisterComponent } from './components/user-management/register/register.component';
import { ResetPasswordComponent } from './components/user-management/reset-password/reset-password.component';
import { WhatsAppButtonComponent } from './components/whats-app-button/whats-app-button.component';

/* Shared Directives */
import { TranslateModule } from '@ngx-translate/core';
import { NgOtpInputModule } from 'ng-otp-input';
import { MobileViewCabinClassComponent } from './components/flights/flight-search-box/flight-search-inputs/cabin-class/mobile-view-cabin-class/mobile-view-cabin-class.component';
import { DateInputComponent } from './components/flights/flight-search-box/flight-search-inputs/date-input/date-input.component';
import { MobileViewDateInputComponent } from './components/flights/flight-search-box/flight-search-inputs/date-input/mobile-view-date-input/mobile-view-date-input.component';
import { DestInputComponent } from './components/flights/flight-search-box/flight-search-inputs/dest-input/dest-input.component';
import { MobileViewDestInputComponent } from './components/flights/flight-search-box/flight-search-inputs/dest-input/mobile-view-dest-input/mobile-view-dest-input.component';
import { InputHeaderComponent } from './components/flights/input-header/input-header.component';
import { DropDownComponent } from './components/navbar/drop-down/drop-down.component';
import { SignOutAlertModalComponent } from './components/navbar/drop-down/sign-out-alert-modal/sign-out-alert-modal.component';
import { OtpComponent } from './components/user-management/otp/otp.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { PassportExpiryDateDirective } from './directives/passport-expiry-date.directive';
import { RestrictArabicDirective } from './directives/restrict-arabic.directive';
import { ScrollAnchorDirective } from './directives/scroll-anchor.directive';
import { ScrollManagerDirective } from './directives/scroll-manager.directive';
import { ScrollSectionDirective } from './directives/scroll-section.directive';
import { CustomDateRangePipe } from './pipes/custom-date-range.pipe';
import { TimeFormatPipe } from './pipes/timeFormat.pipe';
import { NoFlightsComponent } from '../features/flights/flight-results/components/no-flights/no-flights.component';
import { RpHotelsUiModule } from 'rp-hotels-ui';
import { HotelSearchBoxComponent } from './components/hotels/hotel-search-box/hotel-search-box.component';
import { LocationInputComponent } from './components/hotels/hotel-search-box/location-input/location-input.component';
import { HotelDateInputComponent } from './components/hotels/hotel-search-box/hotel-date-input/hotel-date-input.component';
import { MobileLocationInputComponent } from './components/hotels/hotel-search-box/location-input/mobile-location-input/mobile-location-input.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MobileDateInputComponent } from './components/hotels/hotel-search-box/hotel-date-input/mobile-date-input/mobile-date-input.component';
import { GuestRoomSelectorComponent } from './components/hotels/hotel-search-box/guest-room-selector/guest-room-selector.component';
import { MobileGuestRoomSelectorComponent } from './components/hotels/hotel-search-box/guest-room-selector/mobile-guest-room-selector/mobile-guest-room-selector.component';
import { PaymentSummaryComponent } from './components/hotels/payment-summary/payment-summary.component';
import { PaymentViewComponent } from './components/payment-view/payment-view.component';
import { FlightDetailsAppComponent } from './components/flights/flight-details-app/flight-details-app.component';
import { FlightDetailsHeaderAppComponent } from './components/flights/flight-details-app/flight-details-header-app/flight-details-header-app.component';
import { FlightDetailsBodyAppComponent } from './components/flights/flight-details-app/flight-details-body-app/flight-details-body-app.component';
import { InputHeaderAppComponent } from './components/flights/input-header-app/input-header-app.component';
import { ItineraryAppComponent } from './components/flights/flight-details-app/flight-details-body-app/itinerary-app/itinerary-app.component';
import { FlightPathAppComponent } from './components/flights/flight-details-app/flight-details-body-app/itinerary-app/flight-path-app/flight-path-app.component';
import { BaggageDetailsAppComponent } from './components/flights/flight-details-app/flight-details-body-app/baggage-details-app/baggage-details-app.component';
import { FlexFareAppComponent } from './components/flex-fare-app/flex-fare-app.component';
import { FlexFareCardAppComponent } from './components/flex-fare-app/flex-fare-card-app/flex-fare-card-app.component';

export const MatrialComponents = [
  MatButtonModule,
  MatMenuModule,
  MatListModule,
  MatIconModule,
  MatDialogModule,
  MatCardModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatRadioModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatAutocompleteModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatPaginatorModule,
  MatInputModule,
  MatFormFieldModule,
  MatTooltipModule
];

export const ImportedModules = [
  ReactiveFormsModule,
  FormsModule,
  RpTravelUiModule,
  RouterModule,
  NgbDatepickerModule,
  NgbTooltipModule,
  NgxIntlTelInputModule,
  NgOtpInputModule,
  TranslateModule,
  NgbDropdownModule
];

export const SharedComponents = [
  FlightSearchInputsComponent,
  FlightSearchBoxComponent,
  MainButtonComponent,
  SecondaryButtonComponent,
  CabinClassComponent,
  SearchBoxHeaderComponent,
  SearchBoxComponent,
  FlightDetailsComponent,
  FlightDetailsHeaderComponent,
  FlightDetailsBodyComponent,
  ExpansionPanelComponent,
  NavbarComponent,
  DropDownComponent,
  SignOutAlertModalComponent,
  FooterComponent,
  SessionTimeoutComponent,
  SkeletonLoaderComponent,
  WhatsAppButtonComponent,
  PaginatorComponent,
  ItineraryComponent,
  FareRulesComponent,
  BaggageDetailsComponent,
  SpinnerLoaderComponent,
  ErrorSheetComponent,
  LoginComponent,
  RegisterComponent,
  OtpComponent,
  ForgetPasswordComponent,
  ResetPasswordComponent,
  InputHeaderComponent,
  MobileViewDestInputComponent,
  MobileViewDateInputComponent,
  NoFlightsComponent,
  MobileDateInputComponent,
  PaymentSummaryComponent,
  PaymentViewComponent
];

export const SharedDirectives = [
  ClickOutsideDirective,
  PassportExpiryDateDirective,
  ScrollSectionDirective,
  ScrollManagerDirective,
  ScrollAnchorDirective,
  NumbersOnlyDirective,
  RestrictArabicDirective,
];
@NgModule({
  declarations: [SharedComponents, SharedDirectives, FlightPathComponent, DestInputComponent, DateInputComponent, MobileViewCabinClassComponent, CustomDateRangePipe,TimeFormatPipe, FlightDetailsAppComponent, FlightDetailsHeaderAppComponent, FlightDetailsBodyAppComponent, InputHeaderAppComponent, ItineraryAppComponent,FlightPathAppComponent, BaggageDetailsAppComponent, FlexFareAppComponent, FlexFareCardAppComponent,HotelSearchBoxComponent, LocationInputComponent, HotelDateInputComponent, MobileLocationInputComponent, MobileDateInputComponent, GuestRoomSelectorComponent, MobileGuestRoomSelectorComponent],
  imports: [MatrialComponents, ImportedModules, CommonModule],
  exports: [MatrialComponents, ImportedModules, SharedComponents, SharedDirectives,CustomDateRangePipe, TimeFormatPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SharedModule {}
