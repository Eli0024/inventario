import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Mantenimiento } from '../models/manten';
import { MantenService } from '../services/manten.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormmanteComponent } from '../formmante/formmante.component';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-mantenimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent, FormmanteComponent, RouterLink],
  templateUrl: './mantenimiento.component.html',
  styleUrl: './mantenimiento.component.css'
})
export class MantenimientoComponent implements OnInit {

  mantenimientos: Mantenimiento[] = []; // inicializa con un array vacío
  filter: any = { searchTerm: '' };
  mantenimiento: Mantenimiento = {
    responsable: { nombre: '', apellido: '' },
    id: 0,
    equipo: '',
    fecha: '',
    tipo: '',
    descripcion: '',
  };

  mantenimientoSeleccionado: Mantenimiento = {
    responsable: { nombre: '', apellido: '' },
    id: 0,
    equipo: '',
    fecha: '',
    tipo: '',
    descripcion: '',
   };
   
  constructor(private mantenService: MantenService, private cdr: ChangeDetectorRef) {  }

  ngOnInit(): void {
    this.loadMantenimientos();
    }


    editarMantenimiento(mantenimiento: Mantenimiento): void {
      this.mantenimientoSeleccionado = { ...mantenimiento };  // Crea una copia del usuario a editar
      this.openModal();  // Abre el modal
    }
    
    openModal(): void {
      this.modalAbierto = true;
    }
    
    closeModal(): void {
      this.modalAbierto = false;
    }
    

    modalAbierto: boolean = false; 

  loadMantenimientos(): void {
    this.mantenService.getAll().subscribe(
      (response: Mantenimiento[]) => {
        this.mantenimientos = response;
      },
      (error: any) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }

  // Actualizar el usuario
  update(): void {
    if (this.mantenimientoSeleccionado) {
      this.mantenService.update(this.mantenimientoSeleccionado).subscribe(
        (response: Mantenimiento) => {
          console.log('Usuario actualizado', response);
          this.loadMantenimientos(); // Recargar los equipos
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
          this.mantenService.delete(id).subscribe({
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

    filterMantenimientos(): Mantenimiento[] {
      if (this.mantenimientos && this.mantenimientos.length) {
        return this.mantenimientos.filter(Mantenimiento =>
          Mantenimiento.equipo.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
          Mantenimiento.tipo.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
          Mantenimiento.descripcion.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
        );
      }
      return [];
    }
}

