import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotelsConfirmationRoutingModule } from './hotels-confirmation-routing.module';
import { HotelsConfirmationComponent } from './hotels-confirmation.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    HotelsConfirmationComponent
  ],
  imports: [
    CommonModule,
    HotelsConfirmationRoutingModule,
    SharedModule
  ]
})
export class HotelsConfirmationModule { }
