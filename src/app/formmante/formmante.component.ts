import { Component, Input,Output,EventEmitter } from '@angular/core';
import { MantenService } from '../services/manten.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Mantenimiento } from '../models/manten';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Colaborador } from '../models/users';
import { UsersService } from '../services/users.service';
import { Equipo } from '../models/manten';
import { ComputersService } from '../services/computers.service';

@Component({
  selector: 'app-formmante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formmante.component.html',
  styleUrls: ['./formmante.component.css']
})
export class FormmanteComponent {
  mantenimiento: Mantenimiento = {
    id: 0,
    equipo:{
      id: 0,
      marca: '',
      serial: '',
      responsable: {
        id:0,
        nombre:'',
        apellido:''
      }
    },
    equipo_id: 0,
    fecha_mantenimiento: '',
    tipo_mantenimiento: 'preventivo',
    tipo_servicio: 'software',
    descripcion: '',
    realizado_por: '',
  };
  
  @Input() mantenimientoSeleccionado: Mantenimiento | null = null;
  equipos: Equipo[] = [];

  @Output() mantenimientoCreado = new EventEmitter<void>();
  @Output() formularioCancelado = new EventEmitter<void>();

  constructor(
    private mantenService: MantenService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private computersService: ComputersService,
  ) { }

  ngOnInit(): void {
    this.cargar();
    this.loadEquipos();
  }

  cargar(): void {
    this.activatedRoute.params.subscribe(e => {
      let id = e['id'];
      if(id) {
        this.mantenService.getMantenimientoById(id).subscribe(
          mantenimiento => this.mantenimiento = mantenimiento
        );
      }
    });
  }

  loadEquipos(): void {
    this.computersService.getEquipos().subscribe(
      (response: Equipo[]) => {
        this.equipos = response;
      },
      (error: any) => {
        console.error('Error al obtener los equipos', error);
      }
    );
  }

  onEquipoChange(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    this.mantenimiento.equipo_id = id;
  }

  cancelar(): void {
    this.formularioCancelado.emit();
  }

  create(): void {
    if (!this.mantenimiento.equipo_id|| this.mantenimiento.equipo_id === 0) {
      Swal.fire('Error', 'Debes seleccionar un equipo', 'error');
      return;
    }

    this.mantenService.create(this.mantenimiento).subscribe({
      next: () => {
        Swal.fire({
          title: "¡Registro exitoso!",
          text: "El mantenimiento ha sido registrado",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.mantenimientoCreado.emit();
        });
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
}