import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightConfirmationComponent } from './flight-confirmation.component';

const routes: Routes = [{ path: '', component: FlightConfirmationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightConfirmationRoutingModule {}
