import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { InfoComponent } from '../info/info.component';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { LicenciasComponent } from '../licencias/licencias.component';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, InfoComponent, UsuariosComponent, LicenciasComponent],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent {

}
