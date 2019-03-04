import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index.component';
import {ComponentModule} from '../../component/component.module';
// import { PlayerComponent } from '../../component/player/player.component';
// import { StoryPosterItemComponent } from '../../component/story-poster-item/story-poster-item.component';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    IndexRoutingModule,
    ComponentModule,
    MatPaginatorModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IndexModule { }
