import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  usuario: Usuario = {
    id_usuario: 0,
    nombre: '',
    apellido: '',
    empresa: '',
    area: '',
    cargo: '',
    licencia: null,
  };

  usuarioSeleccionado: Usuario = {
    id_usuario: 0,
    nombre: '',
    apellido: '',
    empresa: '',
    area: '',
    cargo: '',
    licencia: null,
   };
   
  constructor(private usersService: UsersService, private cdr: ChangeDetectorRef) {  }

  ngOnInit(): void {
    this.getUsuarios();
    this.loadUsuarios();
    }


    getUsuarios():void{
      this.usersService.getAll().subscribe(
        (data:any)=>{
          this.usuarios=data;
        }
      )
    }

    editarUsuario(usuario:any) {
      this.usuarioSeleccionado = {...usuario};
      this.usuario = {...usuario};
      this.cdr.detectChanges();
    }

    modalAbierto: boolean = false; 

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

  // Abre el modal
  openModal(): void {
    this.modalAbierto = true;
  }

  // Cierra el modal
  closeModal(): void {
    this.modalAbierto = false;
  }

  // Actualizar el usuario
  update(): void {
    if (this.usuarioSeleccionado) {
      this.usersService.update(this.usuarioSeleccionado).subscribe(
        (response: Usuario) => {
          console.log('Usuaario actualizado', response);
          this.loadUsuarios(); // Recargar los equipos
          this.closeModal(); // Cerrar el modal
        },
        (error: any) => {
          console.error('Error al actualizar usuario', error);
        }
      );
    }
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

