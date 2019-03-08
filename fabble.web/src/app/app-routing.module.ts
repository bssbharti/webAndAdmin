import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpComponent } from './template/help/help.component';
import { AboutComponent } from './template/about/about.component';

const routes: Routes = [
  { path: '', loadChildren: './template/index/index.module#IndexModule' },
  { path: 'detail/:id', loadChildren: './template/detail/detail.module#DetailModule' },
  { path: 'help', component:HelpComponent },
  { path: 'about', component:AboutComponent },
  // { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AppRoutingModule { }
