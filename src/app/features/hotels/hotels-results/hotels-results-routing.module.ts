import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelsResultsComponent } from './hotels-results.component';

const routes: Routes = [
  {
    path:':language/:currency/:SearchPoint/:searchId/:locationId/:citywithcountry/:nation/:checkIn/:checkOut/:roomNumber/:cityId/:stringGuest/:residence',
    component: HotelsResultsComponent
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelsResultsRoutingModule { }
