import { Routes } from '@angular/router';
import { ContrasenasComponent } from './contrasenas/contrasenas.component';
import { ContraSiesaComponent } from './contrasenas/contra-siesa/contra-siesa.component';
import { ContraAntivirusComponent } from './contrasenas/contra-antivirus/contra-antivirus.component';
import { ContraVpnComponent } from './contrasenas/contra-vpn/contra-vpn.component';
import { ContraServidorComponent } from './contrasenas/contra-servidor/contra-servidor.component';
import { ContraEquipoComponent } from './contrasenas/contra-equipo/contra-equipo.component';
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
import { DetailsComponent } from './details/details.component';
import { CalendarMantComponent } from './calendar-mant/calendar-mant.component';
import { RegistroTareaComponent } from './registro-tarea/registro-tarea.component';
import { RecuperarContraComponent } from './recuperar-contra/recuperar-contra.component';


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
    { path: 'contrasenas', component: ContrasenasComponent,
        children: [
            {path: 'siesa', component: ContraSiesaComponent},
            {path: 'antivirus', component: ContraAntivirusComponent},
            {path: 'vpn', component: ContraVpnComponent},
            {path: 'servidor', component: ContraServidorComponent},
            {path: 'equipo', component: ContraEquipoComponent},
        ],
    },
    { path: 'sidebar', component: SidebarComponent },
    { path: 'login', component: LoginComponent},
    { path: 'recuperar-contra', component: RecuperarContraComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'details/:id', component: DetailsComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path:'calendario',component:CalendarMantComponent},
    { path: 'registro-tarea', component: RegistroTareaComponent },
    

    
];

