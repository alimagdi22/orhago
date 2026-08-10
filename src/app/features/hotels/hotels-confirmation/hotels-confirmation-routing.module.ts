import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelsConfirmationComponent } from './hotels-confirmation.component';

const routes: Routes = [{ path: '', component: HotelsConfirmationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelsConfirmationRoutingModule { }
