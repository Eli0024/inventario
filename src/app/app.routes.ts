import { Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LicenciasComponent } from './licencias/licencias.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ListaComponent } from './lista/lista.component';
import { FormcompComponent } from './formcomp/formcomp.component';


export const routes: Routes = [
    { path: '', redirectTo: '/content', pathMatch: 'full' },
    { path: 'navbar', component: NavbarComponent },
    { path: 'content', loadChildren: () => import('./content/content.module').then(m => m.ContentModule) },
    { path: 'form1', loadChildren: () => import('./formcomp/formcomp.module').then(m => m.FormcompModule) },
    { path: 'form2', loadChildren: () => import('./formuser/formuser.module').then(m => m.FormuserModule) },
    { path: 'form3', loadChildren: () => import('./formoff/formoff.module').then(m => m.FormoffModule) },
    { path: 'info', loadChildren: () => import('./info/info.module').then(m => m.InfoModule) },
    { path: 'form1/:id/', component: FormcompComponent },
    { path: 'licencias', component: LicenciasComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'sidebar', component: SidebarComponent },
    { path: 'lista', component: ListaComponent },
];
