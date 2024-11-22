import { Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LicenciasComponent } from './licencias/licencias.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ListaComponent } from './lista/lista.component';
import { FormcompComponent } from './formcomp/formcomp.component';
import { FormuserComponent } from './formuser/formuser.component';
import { FormoffComponent } from './formoff/formoff.component';


export const routes: Routes = [
    { path: '', redirectTo: '/content', pathMatch: 'full' },
    { path: 'navbar', component: NavbarComponent },
    { path: 'content', loadChildren: () => import('./content/content.module').then(m => m.ContentModule) },
    { path: 'form1/:id', component: FormcompComponent },  // Asegúrate de que la ruta con parámetro esté antes
    { path: 'form1', loadChildren: () => import('./formcomp/formcomp.module').then(m => m.FormcompModule) },
    { path: 'form2', loadChildren: () => import('./formuser/formuser.module').then(m => m.FormuserModule) },
    { path: 'form2/:id', component: FormuserComponent }, 
    { path: 'form3', loadChildren: () => import('./formoff/formoff.module').then(m => m.FormoffModule) },
    { path: 'form3/:id', component: FormoffComponent },
    { path: 'info', loadChildren: () => import('./info/info.module').then(m => m.InfoModule) },
    { path: 'licencias', component: LicenciasComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'sidebar', component: SidebarComponent },
    { path: 'lista', component: ListaComponent },
];

