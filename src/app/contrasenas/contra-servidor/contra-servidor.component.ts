import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContrasenaServidor } from '../../models/servidor';
import { ServidorService } from '../../services/servidor.service';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormservidorComponent } from '../../formservidor/formservidor.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contra-servidor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    SidebarComponent,
    FormservidorComponent
  ],
  templateUrl: './contra-servidor.component.html',
  styleUrls:['./contra-servidor.component.css'],
})
export class ContraServidorComponent implements OnInit {
  contrasenas: ContrasenaServidor[] = [];
  filter:any = {searchTerm:''};
  modalRegistroAbierto: boolean = false;
  modalEdicionAbierto: boolean = false;
  isSubmittingEditar: boolean = false;

  servidorSeleccionado: ContrasenaServidor={
    tipo:'',
    direccion_ip:'',
    contrasena:'',
    archivo:null
  };

  constructor(
    private servidorService: ServidorService,
    private cdRef:ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.loadContrasenasServidor();
    
  }

  loadContrasenasServidor(): void {
  this.servidorService.getAll().subscribe({
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
 cerrarModalRegistro(): void {
   this.modalRegistroAbierto = false;
 }

 abrirModalEdicion(servidor: ContrasenaServidor): void {
    this.servidorSeleccionado = { ...servidor };
    this.modalEdicionAbierto = true;
  }

  cerrarModalEdicion(): void {
    this.modalEdicionAbierto = false;
  }


 handleRegistroExitoso(nuevaContrsena:ContrasenaServidor):void {
    this.contrasenas.unshift(nuevaContrsena); 
    this.cdRef.detectChanges();
    this.cerrarModalRegistro();
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input?.files?.length) {
    const file: File = input.files[0];
    this.servidorSeleccionado.archivo = file;
  }
 }


  getArchivoUrl(): string {
   if (this.servidorSeleccionado.archivo) {
    return URL.createObjectURL(this.servidorSeleccionado.archivo);
  }
   return '';
 }

  // Maneja la selección de archivo en el modal de edición
  onFileSelectedEditar(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file: File = input.files[0];
      this.servidorSeleccionado.archivo = file;
    }
  }

  // Devuelve el nombre del archivo en edición
  getNombreArchivoEditar(): string {
    if (this.servidorSeleccionado.archivo instanceof File) {
      return this.servidorSeleccionado.archivo.name;
    }
    if (typeof this.servidorSeleccionado.archivo === 'string' && this.servidorSeleccionado.archivo) {
      return 'Archivo cargado';
    }
    return '';
  }

  
  update(): void {
    const formData = new FormData();
    formData.append('tipo', this.servidorSeleccionado.tipo);
    formData.append('direccion_ip', this.servidorSeleccionado.direccion_ip);
    formData.append('contrasena', this.servidorSeleccionado.contrasena);

    if (this.servidorSeleccionado.archivo instanceof File) {
      formData.append('archivo', this.servidorSeleccionado.archivo);
    }

    this.servidorService.update(this.servidorSeleccionado.id!, formData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'La contraseña del servidor ha sido actualizada correctamente.', 'success');
        this.loadContrasenasServidor();
        this.cerrarModalEdicion();
        this.isSubmittingEditar = false;
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        Swal.fire('Error', 'Ocurrió un error al actualizar la contraseña del servidor.', 'error');
      }
    });
  }

 filterPorTipo(tipo: string): ContrasenaServidor[] {
  return this.contrasenas.filter(
    servidor =>
      servidor.tipo === tipo &&
      servidor.direccion_ip.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
  );
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
          this.servidorService.delete(id).subscribe(
            () => {
              // Mostrar alerta de éxito
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

  filterServidor(): ContrasenaServidor[] {
  if (!this.contrasenas || !this.contrasenas.length) return [];

  const term = this.filter.searchTerm.toLowerCase().trim();
  if (!term) return this.contrasenas;

  return this.contrasenas.filter(servidor =>
    servidor.tipo?.toLowerCase().includes(term) ||
    servidor.direccion_ip?.toLowerCase().includes(term) ||
    servidor.contrasena?.toLowerCase().includes(term)
  );
}

}
