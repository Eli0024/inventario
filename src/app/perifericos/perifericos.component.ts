import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Periferico } from '../models/perife';
import { PerifeService } from '../services/perife.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { FormoffComponent } from '../formoff/formoff.component';

@Component({
  selector: 'app-perifericos',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarComponent, RouterLink, FormoffComponent],
  templateUrl: './perifericos.component.html',
  styleUrl: './perifericos.component.css'
})
export class PerifericosComponent implements OnInit {

    perifericos: Periferico[] = []; // inicializa con un array vacío
    filter: any = { searchTerm: '' };
   periferico: Periferico ={
       id_peri: 0,
       nombre: '',
       modelo: '',
       numero_serie: '',
       fecha_adquisicion: '',
       responsable: { // Objeto Responsable por defecto
         nombre: '',
         apellido: ''
       },
     };
     // Ejemplo en el componente
   
      perifericoSeleccionado: Periferico = {
        id_peri: 0,
        nombre: '',
        modelo: '',
        numero_serie: '',
        fecha_adquisicion: '',
        responsable: { // Objeto Responsable por defecto
          nombre: '',
          apellido: ''
        },
      };
     
    constructor(private perifeService: PerifeService, private cdr: ChangeDetectorRef) {  }
  
    ngOnInit(): void {
      this.loadPerifericos();
      }
      
      editarPeriferico(periferico: any) {
        this.perifericoSeleccionado = { ...periferico };
        this.periferico = { ...periferico };
        this.cdr.detectChanges();
      }
      
      openModalAndEdit(periferico: any) {
        this.perifericoSeleccionado = { ...periferico }; // Copia los valores de la licencia seleccionada
        this.modalAbierto = true;
      }
     
      modalAbierto: boolean = false; 
  
    loadPerifericos(): void {
      this.perifeService.getAll().subscribe(
        (response: Periferico[]) => {
          this.perifericos = response;
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
    
    update(): void {
      if (this.perifericoSeleccionado && this.perifericoSeleccionado.id_peri) {  // Asegúrate de que el id esté presente
        this.perifeService.update(this.perifericoSeleccionado).subscribe(
          (response: Periferico) => {
            console.log('Licencia actualizada', response);
            this.loadPerifericos();  // Recargar las licencias
            this.closeModal();  // Cerrar el modal
          },
          (error: any) => {
            console.error('Error al actualizar la licencia', error);
          }
        );
      } else {
        console.error('El id de la licencia es necesario para actualizar.');
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
            this.perifeService.delete(id).subscribe({
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

      filterPerifericos(): Periferico[] {
        if (this.perifericos && this.perifericos.length) {
          return this.perifericos.filter( Periferico =>
            Periferico.nombre.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) 
          );
        }
        return [];
      }
  }

