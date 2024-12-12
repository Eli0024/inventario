import { Component, Input } from '@angular/core';
import { MantenService } from '../services/manten.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Mantenimiento } from '../models/manten';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-formmante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formmante.component.html',
  styleUrl: './formmante.component.css'
})
export class FormmanteComponent {


  mantenimiento: Mantenimiento = {
    id_mantenimiento: 0,
    equipo: '',
    fecha: '',
    tipo: '',
    descripcion: '',
    };
  
  @Input() mantenimientoSeleccionado: any;
 

  constructor(private mantenService: MantenService, private router: Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargar();
   }

  cargar():void{

    this.activatedRoute.params.subscribe(
      e=>{
        let id=e['id'];
        if(id){
          this.mantenService.get(id).subscribe(
            mantenimiento => this.mantenimiento = mantenimiento
          );
        }
      }
    );
  }

  create(): void {
    this.mantenService.create(this.mantenimiento).subscribe(
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
        this.router.navigate(['/manten']);
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
    this.mantenService.update(this.mantenimiento).subscribe(
      () => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registro Actualizado",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/manten']);
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

