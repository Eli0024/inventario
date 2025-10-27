import { Component,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContrasenaSiesa } from '../models/siesa';
import { SiesaService } from '../services/siesa.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-formsiesa',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './formsiesa.component.html',
  styleUrls: ['./formsiesa.component.css']
})

export class FormsiesaComponent {
  siesa:ContrasenaSiesa={
    usuario:'',
    contrasena:'',
    archivo:null
  };

  constructor(private siesaService:SiesaService){}

  @Output() contrasenaCreada = new EventEmitter<ContrasenaSiesa>();
  @Output()cancelarRegistro = new EventEmitter<void>();

  isSubmitting= false;
  fileError='';

  cancelar(): void {
    this.cancelarRegistro.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar tamaño máximo (opcional)
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = 'El archivo no debe exceder los 5MB.';
        this.siesa.archivo = null;
        return;
      }

      this.fileError = '';
      this.siesa.archivo = file;
    } else {
      this.fileError = '';
      this.siesa.archivo = null;
    }
  }

  create(): void {
    console.log('→ Método create() ejecutado');
    if (!this.siesa.usuario.trim() || !this.siesa.contrasena.trim()) {
      Swal.fire('Campos requeridos', 'Los campos "Usuario" y "Contraseña" son obligatorios', 'warning');
      return;
    }
  
    this.isSubmitting = true;
    console.log('→ Enviando datos al servicio:');
  
    const formData = new FormData();
    formData.append('usuario', this.siesa.usuario);
    formData.append('contrasena', this.siesa.contrasena);
  
    if (this.siesa.archivo instanceof File) {
      formData.append('archivo', this.siesa.archivo);
      console.log('→ Archivo adjunto:', this.siesa.archivo.name);
    }
  
    this.siesaService.create(formData).subscribe({
      next: (nueva) => {
        Swal.fire('Registrado', 'Contraseña Siesa registrada correctamente', 'success');
        this.isSubmitting = false;
        this.resetForm();
        this.contrasenaCreada.emit(nueva);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error al registrar:', err);
        Swal.fire('Error', 'Ocurrió un error al registrar la contraseña', 'error');
      }
    });
  }

  getNombreArchivo(): string {
    if (this.siesa.archivo instanceof File) {
      return this.siesa.archivo.name;
    }
    return this.siesa.archivo ? 'Archivo cargado' : '';
  }

  resetForm(): void {
    this.siesa = {
      usuario: '',
      contrasena: '',
      archivo: null
    };
    this.fileError = '';

    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  

}
