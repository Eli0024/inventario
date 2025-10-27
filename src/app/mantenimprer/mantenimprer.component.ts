import { Component, Input, Output,EventEmitter } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { Mantenimpre } from '../models/mantenim';
import { MantenimpreService } from '../services/mantenimpre.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Impresora } from '../models/imprer';
import { ImprerService } from '../services/imprer.service';

@Component({
  selector: 'app-mantenimprer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mantenimprer.component.html',
  styleUrl: './mantenimprer.component.css'
})
export class MantenimprerComponent {
  mantenimpre: Mantenimpre = {
    id: 0,
    impresora:{id:0,nombre:'',direccion_ip:''},
    impresora_id:0,
    fecha: '',
    descripcion: '',
    realizado_por: '',
  };

  
  impresoras:Impresora[]=[];

  @Output() onCreated=new EventEmitter();
  @Output() formularioCancelado = new EventEmitter<void>();


  constructor(
    private mantenimpreService: MantenimpreService, 
    private imprerService:ImprerService,
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargar();
    this.cargarImpresoras();
  }

  cargar(): void {
    this.activatedRoute.params.subscribe(e => {
      let id = e['id'];
      if(id) {
        this.mantenimpreService.getById(id).subscribe(
          mantenimpre => this.mantenimpre = mantenimpre
        );
      }
    });
  }

  cargarImpresoras():void {
    this.imprerService.getAll().subscribe({
      next:(data)=> this.impresoras=data,
      error:(err)=>console.error('Error cargando impresoras',err)
    })
  }


  create(): void {
    this.mantenimpreService.create(this.mantenimpre).subscribe({
      next: (nuevoMantenim) => {
        Swal.fire({
          title: "¡Mantenimiento registrado!",
          text: "El mantenimiento ha sido registrado correctamente",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
        this.onCreated.emit(nuevoMantenim); 

        this.mantenimpre = { 
          id: 0, 
          impresora: {id:0,nombre:'',direccion_ip:''},
          impresora_id:0, 
          fecha: '', 
          descripcion: '', 
          realizado_por: '' }; 
      },
      error: (error) => {
        Swal.fire({
          title: "Error al registrar",
          text: error.message,
          icon: "error"
        });
      }
    });
  }

  cancelar(): void {
  this.mantenimpre = {
    id: 0,
    impresora: { id: 0, nombre: '', direccion_ip: '' },
    impresora_id: 0,
    fecha: '',
    descripcion: '',
    realizado_por: '',
  };
  this.formularioCancelado.emit();
 }

  
  update(): void {
    this.mantenimpreService.update(this.mantenimpre).subscribe({
      next: () => {
        Swal.fire({
          title: "¡Actualización exitosa!",
          text: "El mantenimiento ha sido actualizado correctamente",
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