import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AirlineInfoComponent } from './components/airline-info/airline-info.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'airlines/:slug', component: AirlineInfoComponent },
  { path: 'airline/:slug', component: AirlineInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
