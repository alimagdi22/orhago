import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightCheckoutComponent } from './flight-checkout.component';

const routes: Routes = [{ path: '', component: FlightCheckoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightCheckoutRoutingModule {}
