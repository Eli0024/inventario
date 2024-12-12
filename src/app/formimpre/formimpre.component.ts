import { Component, Input } from '@angular/core';
import { Impresora } from '../models/imprer';
import { ImprerService } from '../services/imprer.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formimpre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formimpre.component.html',
  styleUrl: './formimpre.component.css'
})
export class FormimpreComponent {

  impresora : Impresora = {
    id_impre: 0,
    nombre: '',
    ip: '',
    };
  
  @Input() impresoraSeleccionado: any;
 

  constructor(private imprerService: ImprerService, private router: Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargar();
   }

  cargar():void{

    this.activatedRoute.params.subscribe(
      e=>{
        let id=e['id'];
        if(id){
          this.imprerService.get(id).subscribe(
            impresora => this.impresora = impresora
          );
        }
      }
    );
  }

  create(): void {
    this.imprerService.create(this.impresora).subscribe(
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
        this.router.navigate(['/imprer']);
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
    this.imprerService.update(this.impresora).subscribe(
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

