import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormcompComponent } from './formcomp.component';

const routes: Routes = [
  { path:'', component: FormcompComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormcompRoutingModule { }
