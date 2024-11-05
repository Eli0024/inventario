import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Licence } from '../models/licence';
import { LicenceService } from '../services/licence.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

@Component({
  selector: 'app-licencias',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './licencias.component.html',
  styleUrl: './licencias.component.css'
})
export class LicenciasComponent implements OnInit {

    licences: Licence[] = []; // inicializa con un array vacío
  
     
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
  }