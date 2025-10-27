import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormantivirusComponent } from '../../formantivirus/formantivirus.component';
import { FormsModule } from '@angular/forms';
import { AntivirusService } from '../../services/antivirus.service';
import { ContrasenaAntivirus } from '../../models/antivirus';

@Component({
  selector: 'app-contra-antivirus',
  templateUrl: './contra-antivirus.component.html',
  styleUrls: ['./contra-antivirus.component.css'],
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    FormantivirusComponent,
    FormsModule,
    RouterLink,
  ]
})
export class ContraAntivirusComponent implements OnInit {
  contrasenas: ContrasenaAntivirus[] = []; 
  filter: any = { searchTerm: '' };
  modalRegistroAbierto: boolean = false;
  modalEdicionAbierto = false;

  antivirusSeleccionado: ContrasenaAntivirus = {
    id: 0,
    link: '',
    descripcion: '',
    archivo: null
  };
 

  constructor(
    private antivirusService: AntivirusService,
    
  ) {}

  ngOnInit(): void {
    this.loadContrasenasAntivirus();
  }

  loadContrasenasAntivirus(): void {
  this.antivirusService.getAll().subscribe({
    next: (data) => {
      this.contrasenas = data;
    },
    error: (err) => {
      console.error('Error al cargar contraseñas antivirus:', err);
    }
  });
}
  
 abrirModalRegistro(): void {
   this.modalRegistroAbierto = true;
 }


 abrirModalEdicion(antivirus: ContrasenaAntivirus): void {
   this.antivirusSeleccionado = { ...antivirus };
   this.modalEdicionAbierto = true;
 }

 cerrarModalRegistro(): void {
   this.modalRegistroAbierto = false;
 }


  cerrarModalEdicion(): void {
    this.modalEdicionAbierto = false;
  }

  handleRegistroExitoso():void {
    this.loadContrasenasAntivirus(); 
    this.cerrarModalRegistro();
  }


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.antivirusSeleccionado.archivo = file;
    }
  }

  getArchivoUrl(): string {
    if (typeof this.antivirusSeleccionado.archivo === 'string') {
      return this.antivirusSeleccionado.archivo;
    }
    return '';
  }

  
  getNombreArchivo(antivirus: ContrasenaAntivirus): string {
    if (antivirus.archivo instanceof File) {
      return antivirus.archivo.name;
    }
  return 'Archivo cargado';
}


// Al actualizar
update(): void {
 const formData = new FormData();
  formData.append('link', this.antivirusSeleccionado.link);
  formData.append('descripcion', this.antivirusSeleccionado.descripcion);

  if (this.antivirusSeleccionado.archivo instanceof File) {
    formData.append('archivo', this.antivirusSeleccionado.archivo);
  }

  this.antivirusService.update(this.antivirusSeleccionado.id!,formData).subscribe({
    next: () => {
      Swal.fire('Actualizado', 'La contraseña antivirus ha sido actualizada correctamente.', 'success');
      this.loadContrasenasAntivirus(); // Recargar las contraseñas
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
        this.antivirusService.delete(id).subscribe(
          () => {
            // Mostrar alerta de éxito
            Swal.fire(
              '¡Eliminado!',
              'El equipo ha sido eliminado correctamente.',
              'success'
            );

            // Actualizar la lista de equipos sin recargar la página
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


 filterAntivirus(): ContrasenaAntivirus[] {
  return this.contrasenas.filter(antivirus =>
    antivirus.descripcion.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
  );
}


  
}  
