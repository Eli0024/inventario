import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { FormsiesaComponent } from '../../formsiesa/formsiesa.component';
import { SiesaService } from '../../services/siesa.service';
import { ContrasenaSiesa } from '../../models/siesa';

@Component({
  selector: 'app-contra-siesa',
  standalone: true,
  imports: [NavbarComponent, CommonModule, SidebarComponent, FormsiesaComponent, FormsModule, RouterLink],
  templateUrl:'./contra-siesa.component.html',
  styleUrls: ['./contra-siesa.component.css'],
})
export class ContraSiesaComponent {
  contrasenas: ContrasenaSiesa[] = [];
  filter: any = { searchTerm: '' };
  modalRegistroAbierto: boolean = false;
  modalEdicionAbierto: boolean = false;

  siesaSeleccionado: ContrasenaSiesa = {
    id: 0,
    usuario: '',
    contrasena: '',
    archivo: null
  };

  constructor(
    private siesaService: SiesaService
  ) {}

  ngOnInit(): void {
    this.loadContrasenasSiesa();
  }

  loadContrasenasSiesa(): void {
    this.siesaService.getAll().subscribe({
      next: (data) => {
        this.contrasenas = data;
      },
      error: (err) => {
        console.error('Error al cargar contraseñas Siesa:', err);
      }
    });
  }
  abrirModalRegistro(): void {
    this.modalRegistroAbierto = true;
  }
  cerrarModalRegistro(): void {
    this.modalRegistroAbierto = false;
  }

  handleRegistroExitoso(nuevaContrasena:ContrasenaSiesa): void {
    this.modalRegistroAbierto = false;
    this.contrasenas.push(nuevaContrasena);
  }


  abrirModalEdicion(siesa: ContrasenaSiesa): void {
    this.siesaSeleccionado = { ...siesa };
    this.modalEdicionAbierto = true;
  }
  cerrarModalEdicion(): void {
    this.modalEdicionAbierto = false;
  }

 

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.siesaSeleccionado.archivo = file;
    }
  }

  getArchivoUrl(): string {
    if (typeof this.siesaSeleccionado.archivo === 'string') {
      return this.siesaSeleccionado.archivo;
    }
    return ''
  }

  getNombreArchivo(siesa: ContrasenaSiesa): string {
   if (siesa.archivo instanceof File) {
      return siesa.archivo.name;
    }
    return  'Archivo Cargado';
  }

  update(): void {
    const formData = new FormData();
    formData.append('usuario', this.siesaSeleccionado.usuario);
    formData.append('contrasena', this.siesaSeleccionado.contrasena);

    if (this.siesaSeleccionado.archivo instanceof File) {
      formData.append('archivo', this.siesaSeleccionado.archivo);
    }

    this.siesaService.update(this.siesaSeleccionado.id!, formData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'La contraseña Siesa ha sido actualizada correctamente.', 'success');  

        const index = this.contrasenas.findIndex(c => c.id === this.    siesaSeleccionado.id);
        if (index !== -1) {
           this.contrasenas[index] = { ...this.siesaSeleccionado };
        }

        this.cerrarModalEdicion(); // Cerrar el modal
      
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire('Error', 'Ocurrió un error al actualizar la contraseña antivirus.', 'error'); 
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
        this.siesaService.delete(id).subscribe(
          () => {
            Swal.fire(
              '¡Eliminado!',
              'El equipo ha sido eliminado correctamente.',
              'success'
            );
  
            this.contrasenas = this.contrasenas.filter(c => c.id !== id);
          },
          (error) => {
            if (error.status === 403) {
              Swal.fire(
                'Error',
                'No tienes permisos para eliminar este equipo.',
                'error'
                );
              } else {
                Swal.fire(
                  'Error',
                  'Ocurrió un error al eliminar el equipo.',
                  'error'
                );
              }
              console.error(error);
            }
          );
        }
      });
  }

 get contrasenasFiltradas(): ContrasenaSiesa[] {
  return this.contrasenas.filter(s =>
    s.usuario.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
  );
 }

}
