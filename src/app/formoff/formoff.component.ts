import { Component, EventEmitter, Output } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Licence } from '../models/licence';
import { LicenceService } from '../services/licence.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Equipo } from '../models/computer';
import { ComputersService } from '../services/computers.service';

@Component({
  selector: 'app-formoff',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, SidebarComponent],
  templateUrl: './formoff.component.html',
  styleUrl: './formoff.component.css'
})
export class FormoffComponent {
  @Output() licenceCreada = new EventEmitter<Licence>();
  @Output() formularioCancelado = new EventEmitter<void>();
  
  licence: Licence = {
    tipo_licencia:'',
    correo: '',
    contrasena: '',
    clave_producto: '',
    fecha_compra: '',
    equipo: null,
    equipo_id: null,
  };

  equipos: Equipo []= [];
  isSubmitting = false;

  constructor(
    private licenceService: LicenceService,
    private computersService: ComputersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.cargarEquipos();
  }


  cargarEquipos(): void {
    this.computersService.getEquipos().subscribe({
      next: (data:Equipo[]) => {
        this.equipos = data;
      },
      error: (err:unknown) => {
        console.error('Error al cargar equipos:', err);
        Swal.fire('Error', 'No se pudieron cargar los equipos', 'error');
      }
    });
  }


  create(): void {
    if (!this.licence.equipo_id) {
      Swal.fire('Error', 'Debe seleccionar un equipo', 'error');
      return;
    }

    this.isSubmitting = true;

    this.licenceService.create(this.licence).subscribe({
      next: (createdLicence) => {
        Swal.fire('Éxito', 'Licencia registrada correctamente', 'success');
        this.licenceCreada.emit(createdLicence);
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo registrar la licencia', 'error');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  cancelar(): void {
  this.resetForm();
  this.formularioCancelado.emit();
}
  resetForm(): void {
    this.licence = {
      tipo_licencia:'',
      correo: '',
      contrasena: '',
      clave_producto: '',
      fecha_compra: '',
      equipo: null,
       equipo_id: null
    };
  }

}