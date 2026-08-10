import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelsCheckoutComponent } from './hotels-checkout.component';

const routes: Routes = [{ path: ':pId/:sId/:hotelId/:rooms/:package/:cityId/:nights', component: HotelsCheckoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelsCheckoutRoutingModule { }
