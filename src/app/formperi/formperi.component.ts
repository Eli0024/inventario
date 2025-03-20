import { Component, Input } from '@angular/core';
import { Periferico } from '../models/perife';
import { PerifeService } from '../services/perife.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formperi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formperi.component.html',
  styleUrl: './formperi.component.css'
})
export class FormperiComponent {

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
    
    @Input() perifericoSeleccionado: any;
   
  
    constructor(private perifeService: PerifeService, private router: Router, private activatedRoute:ActivatedRoute) { }
  
    ngOnInit(): void {
      this.cargar();
     }
  
    cargar():void{
  
      this.activatedRoute.params.subscribe(
        e=>{
          let id=e['id'];
          if(id){
            this.perifeService.get(id).subscribe(
              periferico => this.periferico = periferico
            );
          }
        }
      );
    }
  
    create(): void {
      this.perifeService.create(this.periferico).subscribe(
        () => {
          Swal.fire({
            title: "Registro Exitoso",
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
          });
          this.router.navigate(['/perifericos']);
        },
        error => {
          Swal.fire({
            title: "Error al registrar",
            text: error.message,
            icon: "error"
          });
        }
      );
    }
    
    update(): void {
      this.perifeService.update(this.periferico).subscribe(
        () => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Registro Actualizado",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/perifericos']);
        },
        error => {
          Swal.fire({
            title: "Error al actualizar",
            text: error.message,
            icon: "error"
          });
        }
      );
    }
  }
  
