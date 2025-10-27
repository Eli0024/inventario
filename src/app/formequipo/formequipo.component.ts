import { Component, EventEmitter, Output } from '@angular/core';
import { ContrasenaEquipo } from '../models/equipo';
import { EquipoPasswordService } from '../services/equipo.service';
import { UsersService } from '../services/users.service';
import { Colaborador } from '../models/users';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-formequipo',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './formequipo.component.html',
  styleUrls: ['./formequipo.component.css']
})
export class FormequipoComponent {
  nuevaContrasena: ContrasenaEquipo = {
    id: 0,
    usuario: '',
    correo:'',
    contrasena: '',
    responsable: {
      id: 0,
      nombre: '',
      apellido: ''
    },
    archivo: null
  };

  colaboradores: Colaborador[] = [];
  isSubmitting: boolean = false;

  @Output() contrasenaCreada = new EventEmitter<void>();
  @Output() cancelarRegistro = new EventEmitter<void>();

  constructor(
    private equipoService: EquipoPasswordService,
    private userService: UsersService
  ) {
    this.loadColaboradores();
  }

  loadColaboradores(): void {
    this.userService.getAll().subscribe({
      next: (data) => this.colaboradores = data,
      error: (err) => console.error('Error al cargar colaboradores:', err)
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nuevaContrasena.archivo = file;
    }
  }

  create(): void {
    if (!this.nuevaContrasena.responsable.id) {
      alert('Debe seleccionar un responsable');
      return;
    }

    const formData = new FormData();
    formData.append('usuario', this.nuevaContrasena.usuario);
    formData.append('contrasena', this.nuevaContrasena.contrasena);
    formData.append('responsable_id', String(this.nuevaContrasena.responsable.id));
    if (this.nuevaContrasena.archivo instanceof File) {
      formData.append('archivo', this.nuevaContrasena.archivo);
    }

    this.isSubmitting = true;
    this.equipoService.create(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.contrasenaCreada.emit();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al registrar contraseña:', error);
        this.isSubmitting = false;
      }
    });
  }

  

  resetForm(): void {
    this.nuevaContrasena = {
      id: 0,
      usuario: '',
      correo:'',
      contrasena: '',
      responsable: {
        id: 0,
        nombre: '',
        apellido: ''
      },
      archivo: null
    };
  }

  cancelar(): void {
    this.cancelarRegistro.emit();
    this.resetForm();
  }
}
