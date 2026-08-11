import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightResultsComponent } from './flight-results.component';

const routes: Routes = [
  {
    path: ':language/:currency/:SearchPoint/:flightType/:flightInfo/:searchId/:passengers/:Cclass/:directOnly/:destinationType',
    component: FlightResultsComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightResultsRoutingModule {}
