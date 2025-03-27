import { Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LicenciasComponent } from './licencias/licencias.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormcompComponent } from './formcomp/formcomp.component';
import { FormuserComponent } from './formuser/formuser.component';
import { FormoffComponent } from './formoff/formoff.component';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';
import { FormmanteComponent } from './formmante/formmante.component';
import { ImpresoraComponent } from './impresora/impresora.component';
import { FormimpreComponent } from './formimpre/formimpre.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VermasComponent } from './vermas/vermas.component';
import { ReportescomponentComponent } from './reportescomponent/reportescomponent.component';
import { PerifericosComponent } from './perifericos/perifericos.component';


export const routes: Routes = [
    { path: '', redirectTo: '/content', pathMatch: 'full' },
    { path: 'navbar', component: NavbarComponent },
    { path: 'vermas/:id', component: VermasComponent },
    { path: 'reportes', component:ReportescomponentComponent},
    { path: 'content', loadChildren: () => import('./content/content.module').then(m => m.ContentModule) },
    { path: 'form1/:id', component: FormcompComponent },  // Asegúrate de que la ruta con parámetro esté antes
    { path: 'form1', loadChildren: () => import('./formcomp/formcomp.module').then(m => m.FormcompModule) },
    { path: 'form2', loadChildren: () => import('./formuser/formuser.module').then(m => m.FormuserModule) },
    { path: 'form2/:id', component: FormuserComponent }, 
    { path: 'form3', loadChildren: () => import('./formoff/formoff.module').then(m => m.FormoffModule) },
    { path: 'form3/:id', component: FormoffComponent },
    { path: 'info', loadChildren: () => import('./info/info.module').then(m => m.InfoModule) },
    { path: 'manten', component: MantenimientoComponent },
    { path: 'form4/:id', component: FormmanteComponent },
    { path: 'form5/:id', component: FormimpreComponent },
    { path: 'licencias', component: LicenciasComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'impresoras', component: ImpresoraComponent },
    { path: 'perifericos', component: PerifericosComponent },
    { path: 'sidebar', component: SidebarComponent },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
];

