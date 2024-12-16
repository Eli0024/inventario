import { CommonModule } from '@angular/common';
import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LicenceService } from '../services/licence.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormoffComponent } from '../formoff/formoff.component';
import { Licence } from '../models/licence';



@Component({
  selector: 'app-licencias',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent, SidebarComponent, FormoffComponent, RouterLink],
  templateUrl: './licencias.component.html',
  styleUrl: './licencias.component.css'
})
export class LicenciasComponent implements OnInit {

    licences: Licence[] = []; // inicializa con un array vacío
    filter: any = { searchTerm: '' };
    licence : Licence = {
      id_licencia: 0,
      correo: '',
      contrasena: '',
      serial_office: '',
    };
  
    licenceSeleccionado: Licence = {
      id_licencia: 0,
      correo: '',
      contrasena: '',
      serial_office: '',
     };
     
    constructor(private licenceService: LicenceService, private cdr: ChangeDetectorRef) {  }
  
    ngOnInit(): void {
      this.loadLicenses();
      }
      
      editarLicence(licence: any) {
        this.licenceSeleccionado = { ...licence };
        this.licence = { ...licence };
        this.cdr.detectChanges();
      }
      
  
      modalAbierto: boolean = false; 
  
    loadLicenses(): void {
      this.licenceService.getAll().subscribe(
        (response: Licence[]) => {
          this.licences = response;
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
      if (this.licenceSeleccionado && this.licenceSeleccionado.id_licencia) {  // Asegúrate de que el id esté presente
        this.licenceService.update(this.licenceSeleccionado).subscribe(
          (response: Licence) => {
            console.log('Licencia actualizada', response);
            this.loadLicenses();  // Recargar las licencias
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
            this.licenceService.delete(id).subscribe({
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

      filterLicences(): Licence[] {
        if (this.licences && this.licences.length) {
          return this.licences.filter( Licence =>
            Licence.correo.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) 
          );
        }
        return [];
      }
  }
