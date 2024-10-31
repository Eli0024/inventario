import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormoffComponent } from './formoff.component';

const routes: Routes = [
  { path:'', component: FormoffComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormoffRoutingModule { }
