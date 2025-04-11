import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { Mantenimpre } from '../models/mantenim';
import { MantenimpreService } from '../services/mantenimpre.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mantenimprer',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './mantenimprer.component.html',
  styleUrl: './mantenimprer.component.css'
})
export class MantenimprerComponent {

  mantenimpre : Mantenimpre = {
  
     impresora: { nombre: '' },
     id: 0,
     fecha: '',
     descripcion: '',
     realizado_por: '',
   };
 
  
  @Input() mantenimpreSeleccionado: any;
 

  constructor(private mantenimpreService: MantenimpreService, private router: Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargar();
   }

  cargar():void{

    this.activatedRoute.params.subscribe(
      e=>{
        let id=e['id'];
        if(id){
          this.mantenimpreService.get(id).subscribe(
            mantenimpre => this.mantenimpre = mantenimpre
          );
        }
      }
    );
  }

  create(): void {
    this.mantenimpreService.create(this.mantenimpre).subscribe(
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
        this.router.navigate(['/impresoras']);
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
    this.mantenimpreService.update(this.mantenimpre).subscribe(
      () => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registro Actualizado",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/impresoras']);
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

