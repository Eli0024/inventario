import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { InfoComponent } from '../info/info.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormcompComponent } from '../formcomp/formcomp.component';
import { Usuario } from '../models/users';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [NavbarComponent, RouterLink, InfoComponent, SidebarComponent, FormsModule, CommonModule,FormcompComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit{
 
  showSidebar = true; // Controla la visibilidad del sidebar

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
  
  constructor(private usersService: UsersService, private cdr: ChangeDetectorRef) {  }

  ngOnInit(): void {
    this.loadUsuarios();
    }

    loadUsuarios(): void {
      this.usersService.getAll().subscribe(
        (response: Usuario[]) => {
          this.usuarios = response;
        },
        (error: any) => {
          console.error('Error al obtener los usuarios', error);
        }
      );
    }

  usuarios: Usuario[] = [];

  usuario: Usuario = {
    id_usuario: 0,
    nombre: '',
    apellido: '',
    empresa: null,
    area: null,
    cargo: '',
    licencia: null,
  };

  filter: any = { searchTerm: '' };
  
  filterUsuarios(): Usuario[] {
    if (this.usuarios && this.usuarios.length) {
      return this.usuarios.filter(Usuario =>
        Usuario.nombre.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
        Usuario.apellido.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
      );
    }
    return [];
  }
}
