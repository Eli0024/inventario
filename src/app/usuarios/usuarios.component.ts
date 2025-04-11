import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Colaborador } from '../models/users';
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

  colaboradores : Colaborador[] = []; // inicializa con un array vacío
  filter: any = { searchTerm: '' };
  colaborador: Colaborador = {
    id: 0,
    nombre: '',
    apellido: '',
    empresa: null,
    area: null,
    cargo: '',
  };

  colaboradorSeleccionado: Colaborador = {
    id: 0,
    nombre: '',
    apellido: '',
    empresa: null,
    area: null,
    cargo: '',
   };
   
  constructor(private usersService: UsersService, private cdr: ChangeDetectorRef) {  }

  ngOnInit(): void {
    this.loadColaboradores();
    }

    openModalAndEdit(colaborador: any) {
      this.colaboradorSeleccionado = { ...colaborador }; // Copia los valores del colaborador seleccionado
      this.modalAbierto = true;
    }
    

    editarColaborador(colaborador: Colaborador): void {
      this.colaboradorSeleccionado = { ...colaborador };  // Crea una copia del usuario a editar
      this.openModal();  // Abre el modal
    }
    
    openModal(): void {
      this.modalAbierto = true;
    }
    
    closeModal(): void {
      this.modalAbierto = false;
    }
    

    modalAbierto: boolean = false; 

  loadColaboradores(): void {
    this.usersService.getAll().subscribe(
      (response: Colaborador[]) => {
        this.colaboradores = response;
      },
      (error: any) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }

  // Actualizar el usuario
  update(): void {
    if (this.colaboradorSeleccionado) {
      this.usersService.update(this.colaboradorSeleccionado).subscribe(
        (response: Colaborador) => {
          console.log('Usuaario actualizado', response);
          this.loadColaboradores(); // Recargar los equipos
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

    filterColaboradores(): Colaborador[] {
      if (this.colaboradores && this.colaboradores.length) {
        return this.colaboradores.filter(Colaborador =>
          Colaborador.nombre.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
          Colaborador.apellido.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
        );
      }
      return [];
    }

    onEmpresaChange(event: any) {
      console.log("Empresa seleccionada:", event);  // Aquí puedes realizar más acciones si lo deseas.
      this.colaboradorSeleccionado.empresa = event;
    }
    
    onAreaChange(event: any) {
      console.log("Area seleccionada:", event);  // Aquí puedes realizar más acciones si lo deseas.
      this.colaboradorSeleccionado.area = event;
    }
    
  }


