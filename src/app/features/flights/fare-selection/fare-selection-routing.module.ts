import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FareSelectionComponent } from './fare-selection.component';

const routes: Routes = [
  {
    path: '',
    component: FareSelectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FareSelectionRoutingModule {}
