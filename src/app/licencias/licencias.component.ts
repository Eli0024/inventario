import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Licence } from '../models/licence';
import { LicenceService } from '../services/licence.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormoffComponent } from '../formoff/formoff.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-licencias',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NavbarComponent, SidebarComponent],
  imports: [FormsModule, CommonModule, NavbarComponent, SidebarComponent, FormoffComponent, RouterLink],
  templateUrl: './licencias.component.html',
  styleUrl: './licencias.component.css'
})
export class LicenciasComponent implements OnInit {

    licences: Licence[] = []; // inicializa con un array vacío
    filter: any = { searchTerm: '' };
     
    constructor(private licenceService: LicenceService) {  }
  
    ngOnInit(): void {
      this.getLicences();
      }
      getLicences():void{
        this.licenceService.getAll().subscribe(
          (data:any)=>{
            this.licences=data;
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
            Licence.nombre.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) 
          );
        }
        return [];
      }
  }
