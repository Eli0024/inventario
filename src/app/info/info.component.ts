import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Equipo } from '../models/computer';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ComputersService } from '../services/computers.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit {

  equipos: Equipo[] = []; // inicializa con un array vacío

   
  constructor(private computersService: ComputersService) {  }

  ngOnInit(): void {
    this.getEquipos();
    }
    getEquipos():void{
      this.computersService.getAll().subscribe(
        (data:any)=>{
          this.equipos=data;
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
          this.computersService.delete(id).subscribe({
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