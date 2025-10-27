import { Component, Input, Output,EventEmitter } from '@angular/core';
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
  styleUrls: ['./formimpre.component.css']
})
export class FormimpreComponent {
  impresora: Impresora = {
    id: 0,
    nombre: '',
    direccion_ip: '',
  };
  
  @Output() formularioCancelado = new EventEmitter<void>();
  @Output() impresoraCreada = new EventEmitter<any>();
  @Input() impresoraSeleccionado: any;

  isSubmitting: boolean = false;


  constructor(
    private imprerService: ImprerService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargar();
  }

 

  cargar(): void {
    this.activatedRoute.params.subscribe(e => {
      let id = e['id'];
      if(id) {
        this.imprerService.get(id).subscribe(
          impresora => this.impresora = impresora
        );
      }
    });
  }

  create(): void {

    if (!this.impresora.nombre.trim() || !this.impresora.direccion_ip.trim()) {
    Swal.fire({
      title: "Campos incompletos",
      text: "Por favor completa todos los campos antes de registrar.",
      icon: "warning"
    });
    return;
  }

  this.isSubmitting = true;
  
    const nuevaImpresora:Impresora={...this.impresora}

    this.imprerService.create(nuevaImpresora).subscribe({
      next: () => {
        Swal.fire({
          title: "¡Registro exitoso!",
          text: "La impresora ha sido registrada correctamente",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/impresoras']);
        });

        this.impresoraCreada.emit(nuevaImpresora);
        this.isSubmitting=false;
        this.impresora = { id: 0, nombre: '', direccion_ip: '' };
      },
      error: (error) => {
         this.isSubmitting = false;
        Swal.fire({
          title: "Error al registrar",
          text: error.message,
          icon: "error"
        });
      }
    });
  }

  cancelar(): void {
     this.impresora = { id: 0, nombre: '', direccion_ip: '' };
   this.formularioCancelado.emit(); 
 } 
  
  update(): void {
    this.imprerService.update(this.impresora).subscribe({
      next: () => {
        Swal.fire({
          title: "¡Actualización exitosa!",
          text: "La impresora ha sido actualizada correctamente",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/impresoras']);
        });
      },
      error: (error) => {
        Swal.fire({
          title: "Error al actualizar",
          text: error.message,
          icon: "error"
        });
      }
    });
  }
}