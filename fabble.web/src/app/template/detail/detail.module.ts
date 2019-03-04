import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ComponentModule} from '../../component/component.module';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';

@NgModule({
  declarations: [DetailComponent, ],
  imports: [
    CommonModule,
    DetailRoutingModule,
    ComponentModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DetailModule { }