import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ComputersService } from '../services/computers.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormcompComponent } from '../formcomp/formcomp.component';
import { FormsModule } from '@angular/forms';
import { Equipo } from '../models/computer';


@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    FormcompComponent,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
})
export class InfoComponent implements OnInit {

  equipos: Equipo[] = []; // inicializa con un array vacío
  isStaff = false;
  filter: any = { searchTerm: '' };
  equipo: Equipo ={
    id: 0,
    marca: '',
    memoria: '',
    modelo: '',
    procesador: '',
    office: '',
    serial: '',
    sistema_operativo: '',
    fecha_adquisicion: '',
    estado: '',
    responsable: { // Objeto Responsable por defecto
      id: 0,
      nombre: '',
      apellido: ''
    },
    archivo: null
  };
  // Ejemplo en el componente

  equipoSeleccionado: any = {
    marca: '',
    modelo: '',
    memoria: '',
    procesador: '',
    office: '',
    serial: '',
    sistema_operativo: '',
    fecha_adquisicion: '',
    estado: '',
    archivo: null,
    responsable: {
      nombre: '',
      apellido: ''
    }
  };


  constructor(
    private computersService: ComputersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
    // this.getEquipos();
    this.loadEquipos();
  }

  cargar(): void {
    this.computersService.getEquipos().subscribe(
      (equipos) => {
        this.equipos = equipos;  // Actualizar la lista de equipos
      },
      (error) => {
        console.error('Error al cargar los equipos:', error);
      }
    );
  }

  getArchivoUrl(): string {
    return this.equipoSeleccionado.archivo;
  }

  getNombreArchivo(): string {
    if (this.equipoSeleccionado.archivo) {
      return this.equipoSeleccionado.archivo.split('/').pop() || 'documento';
    }
    return '';
  }

  // Al obtener los datos
getEquipos(id: number): void {
  this.computersService.getEquipo(id).subscribe({
    next: (equipo) => {
      this.equipoSeleccionado = equipo;
      // Asegura que el responsable tenga estructura válida
      if (!this.equipoSeleccionado.responsable) {
        this.equipoSeleccionado.responsable = {
          id: null,
          nombre: '',
          apellido: ''
        };
      }
      console.log('Datos recibidos:', this.equipoSeleccionado);
    },
    error: (err) => console.error('Error al obtener equipo:', err)
  });
}

  editarEquipo(equipo: any) {
    this.equipoSeleccionado = { ...equipo };
    this.equipo = { ...equipo }; // También actualizamos 'this.equipo'
    this.cdr.detectChanges();  // Asegura que la vista se actualice
  }

  openModalAndEdit(equipo: any) {
    this.equipoSeleccionado = { ...equipo }; // Copia los valores del equipo seleccionado
    this.modalAbierto = true;
  }
  
  closeModal() {
    this.modalAbierto = false;
  }

  
  modalAbierto: boolean = false; 

  loadEquipos(): void {
    this.computersService.getEquipos().subscribe(
      (response: Equipo[]) => {
        this.equipos = response;
      },
      (error: any) => {
        console.error('Error al obtener los equipos', error);
      }
    );
  }

  // Abre el modal
  openModal(): void {
    this.modalAbierto = true;
  }

// Al obtener los datos
getEquipo(id: number): void {
  this.computersService.getEquipo(id).subscribe({
    next: (equipo) => {
      this.equipoSeleccionado = equipo;
      
      // Asegura que el responsable tenga estructura válida
      if (!this.equipoSeleccionado.responsable) {
        this.equipoSeleccionado.responsable = {
          id: null,
          nombre: 'No asignado',
          apellido: ''
        };
      }
      console.log('Datos cargados:', this.equipoSeleccionado);
    },
    error: (err) => console.error('Error al cargar equipo:', err)
  });
}

// Al actualizar
update(): void {
  if (!this.equipoSeleccionado.responsable?.id) {
    alert('Debe seleccionar un responsable válido');
    return;
  }

  this.computersService.update(this.equipoSeleccionado).subscribe({
    next: (response) => {
      console.log('Actualización exitosa:', response);
      this.loadEquipos(); // Recargar los equipos
      this.closeModal(); // Cerrar el modal
    },
    error: (err) => {
      console.error('Error completo:', err);
      if (err.error) {
        alert(JSON.stringify(err.error));
      }
    }
  });
}
              

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.equipoSeleccionado.archivo = file;
      this.equipoSeleccionado.archivoNombre = file.name;
    }
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
        this.computersService.delete(id).subscribe(
          () => {
            // Mostrar alerta de éxito
            Swal.fire(
              '¡Eliminado!',
              'El equipo ha sido eliminado correctamente.',
              'success'
            );

            // Actualizar la lista de equipos sin recargar la página
            this.equipos = this.equipos.filter(equipo => equipo.id !== id);
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


  filterEquipos(): Equipo[] {
    if (this.equipos && this.equipos.length) {
      return this.equipos.filter(
        (Equipo) =>
          Equipo.marca
            .toLowerCase()
            .includes(this.filter.searchTerm.toLowerCase()) ||
          Equipo.memoria
            .toLowerCase()
            .includes(this.filter.searchTerm.toLowerCase())
             // No es necesario `toLowerCase` porque es un número
      );
    }
    return [];
  }
}  
