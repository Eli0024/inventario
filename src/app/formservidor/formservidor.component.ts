import { Component, EventEmitter, Output } from '@angular/core';
import { ContrasenaServidor } from '../models/servidor';
import { ServidorService } from '../services/servidor.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formservidor',
  standalone:true,
  imports: [FormsModule,CommonModule],
  templateUrl: './formservidor.component.html',
  styleUrls: ['./formservidor.component.css']
})
export class FormservidorComponent {
  @Output() contrasenaCreada = new EventEmitter<ContrasenaServidor>();
  @Output() cancelarRegistro = new EventEmitter<void>();

  isSubmitting:boolean = false;
  fileError = '';

  servidor: ContrasenaServidor = {
    id: 0,
    tipo: '',
    direccion_ip: '',
    contrasena: '',
    archivo: null
  };

  constructor(private servidorService: ServidorService) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.servidor.archivo = file ? file : null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar tamaño máximo (opcional)
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = 'El archivo no debe exceder los 5MB.';
        this.servidor.archivo = null;
        return;
      }

      this.fileError = '';
      this.servidor.archivo = file;
    } else {
      this.fileError = '';
      this.servidor.archivo = null;
    }
  }

  create(): void {
    console.log('→ Método create() ejecutado');
    if ( !this.servidor.tipo.trim()||!this.servidor.direccion_ip.trim() || !this.servidor.contrasena.trim()) {
      Swal.fire('Campos requeridos', 'Los campos "Tipo de servidor" "Direccion Ip" y "Contraseña" son obligatorios', 'warning');
      return;
    }
  
    this.isSubmitting = true;
    console.log('→ Enviando datos al servicio:');
  
    const formData = new FormData();
    formData.append('tipo', this.servidor.tipo);
    formData.append('direccion_ip', this.servidor.direccion_ip);
    formData.append('contrasena', this.servidor.contrasena);
  
    if (this.servidor.archivo instanceof File) {
      formData.append('archivo', this.servidor.archivo);
      console.log('→ Archivo adjunto:', this.servidor.archivo.name);
    }
  
    this.servidorService.create(formData).subscribe({
      next: (data:any) => {
        Swal.fire('Registrado', 'Contraseña VPN registrada correctamente', 'success');
        this.isSubmitting = false;
        this.resetForm();
        this.contrasenaCreada.emit(data);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error al registrar:', err);
        Swal.fire('Error', 'Ocurrió un error al registrar la contraseña', 'error');
      }
    });
}

  getNombreArchivo(): string {
    if (this.servidor.archivo instanceof File) {
      return this.servidor.archivo.name;
    }
    return this.servidor.archivo ? 'Archivo cargado' : '';
  }

  resetForm(): void {
    this.servidor = {
      id: 0,
      tipo: '',
      direccion_ip: '',
      contrasena: '',
      archivo: null
    };
    this.fileError = '';
  }
  
  cancelar() {
    this.servidor = {
      id: 0,
      tipo: '',
      direccion_ip: '',
      contrasena: '',
      archivo: null
    };
    this.cancelarRegistro.emit();
  }
}
