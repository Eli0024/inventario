import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/users';
import { UsersService } from '../services/users.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormuserComponent } from '../formuser/formuser.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, FormsModule, RouterLink, FormuserComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = []; // inicializa con un array vacío
  filter: any = { searchTerm: '' };
   
  constructor(private usersService: UsersService) {  }

  ngOnInit(): void {
    this.getUsuarios();
    }
    getUsuarios():void{
      this.usersService.getAll().subscribe(
        (data:any)=>{
          this.usuarios=data;
        }
      )
    }
  
   delete(id: number) {
      console.log(id);
      
      Swal.fire({
        title: "¿Desea eliminar este registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, ¡elimínalo!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.usersService.delete(id).subscribe({
            next: () => {
              Swal.fire({
                title: "¡Eliminado!",
                text: "El registro ha sido eliminado.",
                icon: "success"
              });
              this.ngOnInit(); // Actualiza la vista
            },
            error: (err) => {
              console.error('Error:', err);
              Swal.fire({
                title: "Error",
                text: "Hubo un problema al eliminar el registro.",
                icon: "error"
              });
            }
          });
        }
      });
    }

    filterUsuarios(): Usuario[] {
      if (this.usuarios && this.usuarios.length) {
        return this.usuarios.filter(Usuario =>
          Usuario.nombre.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
          Usuario.apellido.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
          Usuario.empresa.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
        );
      }
      return [];
    }
}

