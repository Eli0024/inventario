import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { FormvpnComponent } from '../../formvpn/formvpn.component';
import { VpnService } from '../../services/vpn.service';
import { ContrasenaVPN } from '../../models/vpn';

@Component({
  selector: 'app-contra-vpn',
  standalone: true,
  imports: [NavbarComponent,CommonModule,SidebarComponent,FormsModule,FormvpnComponent,RouterLink],
  templateUrl: './contra-vpn.component.html',
  styleUrls: ['./contra-vpn.component.css']
})
export class ContraVpnComponent {
  contrasenas:ContrasenaVPN[]=[];
  filter: any = { searchTerm: '' };
  modalRegistroAbierto: boolean = false;
  modalEdicionAbierto: boolean = false;
  
  vpnSeleccionado: ContrasenaVPN = {
    id: 0,
    direccion_ip:'',
    usuario: '',
    contrasena: '',
    archivo: null
  };

  constructor(
    private vpnService:VpnService

  ){}

  ngOnInit(): void {
    this.loadContrasenasVPN();
  }

  loadContrasenasVPN(): void {
    this.vpnService.getAll().subscribe({
      next: (data) => {
        this.contrasenas = data;
      },
      error: (err) => {
        console.error('Error al cargar contraseñas VPN:', err);
      }
    });
  }

  abrirModalRegistro(): void {
    this.modalRegistroAbierto = true;
  }
  cerrarModalRegistro(): void {
     this.modalRegistroAbierto = false;
  }
  
  abrirModalEdicion(vpn: ContrasenaVPN): void {
   this.vpnSeleccionado = { ...vpn };
   this.modalEdicionAbierto = true;
  }
  cerrarModalEdicion(): void {
    this.modalEdicionAbierto = false;
  }
  
  handleRegistroExitoso(): void {
    this.modalRegistroAbierto = false;
    this.loadContrasenasVPN();
  }

  onFileSelected(event: any): void {
      const file: File = event.target.files[0];
      if (file) {
        this.vpnSeleccionado.archivo = file;
      }
  }
  
  getArchivoUrl(): string {
      if (typeof this.vpnSeleccionado.archivo === 'string') {
        return this.vpnSeleccionado.archivo;
      }
      return ''
  }
  
  getNombreArchivo(siesa: ContrasenaVPN): string {
     if (siesa.archivo instanceof File) {
        return siesa.archivo.name;
      }
      return  'Archivo Cargado';
  }

  update(): void {
      const formData = new FormData();
      formData.append('direccion_ip', this.vpnSeleccionado.direccion_ip);
      formData.append('usuario', this.vpnSeleccionado.usuario);
      formData.append('contrasena', this.vpnSeleccionado.contrasena);
  
      if (this.vpnSeleccionado.archivo instanceof File) {
        formData.append('archivo', this.vpnSeleccionado.archivo);
      }
  
      this.vpnService.update(this.vpnSeleccionado.id!, formData).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'La contraseña Vpn ha sido actualizada correctamente.', 'success');
          this.loadContrasenasVPN(); 
          this.cerrarModalEdicion(); 
          },
          error: (err) => {
            console.error('Error al actualizar:', err);
            Swal.fire('Error', 'Ocurrió un error al actualizar la contraseña VPN.', 'error'); 
          }
      });
  }

  delete(id: number): void {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.vpnService.delete(id).subscribe(
            () => {
              // Mostrar alerta de éxito
              Swal.fire(
                '¡Eliminado!',
                'La contraseña ha sido eliminado correctamente.',
                'success'
              );
  
              // Actualizar la lista de equipos sin recargar la página
              this.contrasenas = this.contrasenas.filter(c => c.id !== id);
            },
            (error) => {
              if (error.status === 403) {
                Swal.fire(
                  'Error',
                  'No tienes permisos para eliminar esta contraseña.',
                  'error'
                );
              } else {
                Swal.fire(
                  'Error',
                  'Ocurrió un error al eliminar la contraseña.',
                  'error'
                );
              }
              console.error(error);
            }
          );
        }
      });
  }

  filtervpn(): ContrasenaVPN[] {
    return this.contrasenas.filter(
      antivirus =>
      antivirus.usuario.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
      antivirus.direccion_ip.toLocaleLowerCase().includes(this.filter.searchTerm.toLowerCase())
    );
  }


}
