import { Component,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContrasenaVPN } from '../models/vpn';
import { VpnService } from '../services/vpn.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formvpn',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './formvpn.component.html',
  styleUrls: ['./formvpn.component.css']
})
export class FormvpnComponent {
  vpn:ContrasenaVPN={
    direccion_ip:'',
    usuario:'',
    contrasena:'',
    archivo:null
  };

  constructor(private vpnService:VpnService){}
  
  @Output() contrasenaCreada = new EventEmitter<void>();
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
        this.vpn.archivo = null;
        return;
      }

      this.fileError = '';
      this.vpn.archivo = file;
    } else {
      this.fileError = '';
      this.vpn.archivo = null;
    }
  }

  create(): void {
      console.log('→ Método create() ejecutado');
      if ( !this.vpn.direccion_ip.trim()||!this.vpn.usuario.trim() || !this.vpn.contrasena.trim()) {
        Swal.fire('Campos requeridos', 'Los campos "Direccion Ip" "Usuario" y "Contraseña" son obligatorios', 'warning');
        return;
      }
    
      this.isSubmitting = true;
      console.log('→ Enviando datos al servicio:');
    
      const formData = new FormData();
      formData.append('direccion_ip', this.vpn.direccion_ip);
      formData.append('usuario', this.vpn.usuario);
      formData.append('contrasena', this.vpn.contrasena);
    
      if (this.vpn.archivo instanceof File) {
        formData.append('archivo', this.vpn.archivo);
        console.log('→ Archivo adjunto:', this.vpn.archivo.name);
      }
    
      this.vpnService.create(formData).subscribe({
        next: () => {
          Swal.fire('Registrado', 'Contraseña VPN registrada correctamente', 'success');
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
    if (this.vpn.archivo instanceof File) {
      return this.vpn.archivo.name;
    }
    return this.vpn.archivo ? 'Archivo cargado' : '';
  }

  resetForm(): void {
    this.vpn = {
      direccion_ip:'',
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
