import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { FareSelectionRoutingModule } from './fare-selection-routing.module';
import { FareSelectionComponent } from './fare-selection.component';
import { FareOptionCardComponent } from './fare-option-card/fare-option-card.component';

@NgModule({
  declarations: [FareSelectionComponent, FareOptionCardComponent],
  imports: [CommonModule, SharedModule, FareSelectionRoutingModule],
})
export class FareSelectionModule {}
