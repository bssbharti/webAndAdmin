import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: './template/index/index.module#IndexModule' },
  { path: 'detail/:id', loadChildren: './template/detail/detail.module#DetailModule' },
  // { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AppRoutingModule { }
