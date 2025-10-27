import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContrasenaAntivirus } from '../models/antivirus';
import { AntivirusService } from '../services/antivirus.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-formantivirus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formantivirus.component.html',
  styleUrls: ['./formantivirus.component.css']
})
export class FormantivirusComponent {
  antivirus: ContrasenaAntivirus = {
    link: '',
    descripcion: '',
    archivo: null
  };

  constructor(private antivirusService: AntivirusService) {}

  @Output() contrasenaCreada = new EventEmitter<void>();
  @Output()cancelarRegistro = new EventEmitter<void>();
  
  isSubmitting = false;
  fileError = '';


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
        this.antivirus.archivo = null;
        return;
      }

      this.fileError = '';
      this.antivirus.archivo = file;
    } else {
      this.fileError = '';
      this.antivirus.archivo = null;
    }
  }

  create(): void {
    console.log('→ Método create() ejecutado');
    if (!this.antivirus.link.trim() || !this.antivirus.descripcion.trim()) {
      Swal.fire('Campos requeridos', 'Los campos "Link" y "Descripción" son obligatorios', 'warning');
      return;
    }

    this.isSubmitting = true;
    console.log('→ Enviando datos al servicio:');

    const formData = new FormData();
    formData.append('link', this.antivirus.link);
    formData.append('descripcion', this.antivirus.descripcion);

    if (this.antivirus.archivo instanceof File) {
      formData.append('archivo', this.antivirus.archivo);
      console.log('→ Archivo adjunto:', this.antivirus.archivo.name);
    }

    this.antivirusService.create(formData).subscribe({
      next: () => {
        Swal.fire('Registrado', 'Contraseña antivirus registrada correctamente', 'success');
        this.isSubmitting = false;
        this.resetForm();
        this.contrasenaCreada.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error al registrar:', err);
        Swal.fire('Error', 'Ocurrió un error al registrar la contraseña', 'error');
      }
    });
  }

  getNombreArchivo(): string {
    if (this.antivirus.archivo instanceof File) {
      return this.antivirus.archivo.name;
    }
    return this.antivirus.archivo ? 'Archivo cargado' : '';
  }

  resetForm(): void {
    this.antivirus = {
      link: '',
      descripcion: '',
      archivo: null
    };
    this.fileError = '';

    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
