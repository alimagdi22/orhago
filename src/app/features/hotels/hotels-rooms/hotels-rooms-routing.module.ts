import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelsRoomsComponent } from './hotels-rooms.component';

const routes: Routes = [{ path: '', component: HotelsRoomsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelsRoomsRoutingModule { }
