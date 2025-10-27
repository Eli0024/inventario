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
import { Colaborador } from '../models/users';
import { UsersService } from '../services/users.service';
import { LicenceService } from '../services/licence.service';
import { Authservice } from '../auth.service';

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

  equipos: Equipo[] = [];
  colaboradores:Colaborador[]=[];
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

  licenciasEquipo: any[] = [];
  modalLicenciasAbierto = false;

  modalRegistroAbierto: boolean = false;
  mostrarTodos: boolean = false;
empresaActualId: number | null = null;
 

  openRegistroModal() {
    this.modalRegistroAbierto = true;
  }
  closeRegistroModal() {
    this.modalRegistroAbierto = false;
  }


  constructor(
    private computersService: ComputersService,
    private userService:UsersService,
    private licenceService: LicenceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: Authservice
  ) {}

  ngOnInit(): void {
    this.loadEmpresaActual();
    this.loadEquipos();
    this.loadColaboradores();
  }

  loadEmpresaActual(): void {

    this.empresaActualId = this.authService.getEmpresaId(); 
  }

  verLicenciasDeEquipo(equipoId: number) {
  console.log('Cargando licencias del equipo con ID:', equipoId);

  this.licenceService.getByEquipo(equipoId).subscribe({
    next: (res) => {
      console.log('Licencias cargadas:', res);
      this.licenciasEquipo= res;
      this.modalLicenciasAbierto = true;
      console.log('Estado del modal:', this.modalLicenciasAbierto);
    },
    error: (err) => console.error('Error al cargar licencias:', err)
  });
 }

 cerrarModalLicencias() {
   this.modalLicenciasAbierto = false;
   this.licenciasEquipo = [];
 }


  onEquipoCreado(nuevo: any): void {
  this.loadEquipos(); 
  this.closeRegistroModal(); 
  }
 
  get colaboradoresFiltrados() {
    if (this.mostrarTodos || !this.empresaActualId) {
      return this.colaboradores;
    }
    return this.colaboradores.filter(
      c => c.empresa?.id === this.empresaActualId
    );
  }

  toggleFiltroColaboradores(): void {
    this.mostrarTodos = !this.mostrarTodos;
  }

  loadColaboradores(): void {
    this.userService.getAllGlobal().subscribe({
      next: (data) => {
        this.colaboradores = data;
      },
      error: (err) => {console.error('Error al cargar colaboradores:', err);
      }
    });
  }

  getNombreResponsable(id: number): string {
    const colab = this.colaboradores.find(c => c.id === id);
    return colab ? `${colab.nombre} ${colab.apellido}` : 'No asignado';
  }


  onResponsableChange(event: any): void {
    const selectedId = Number(event.target.value);
    const selectedColaborador = this.colaboradores.find(c => c.id === selectedId);
    
    if (selectedColaborador) {
      this.equipoSeleccionado.responsable = {
        id: selectedColaborador.id,
        nombre: selectedColaborador.nombre,
        apellido: selectedColaborador.apellido
      };
    } else {
      this.equipoSeleccionado.responsable = {
        id: null,
        nombre: '',
        apellido: ''
      };
    }
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
    const term = this.filter.searchTerm.toLowerCase().trim();

    return this.equipos.filter(equipo =>
      equipo.marca?.toLowerCase().includes(term) ||
      equipo.modelo?.toLowerCase().includes(term) ||
      equipo.memoria?.toLowerCase().includes(term) ||
      equipo.procesador?.toLowerCase().includes(term) ||
      equipo.office?.toLowerCase().includes(term) ||
      equipo.serial?.toLowerCase().includes(term) ||
      equipo.sistema_operativo?.toLowerCase().includes(term) ||
      equipo.fecha_adquisicion?.toLowerCase().includes(term) ||
      equipo.estado?.toLowerCase().includes(term) ||
      equipo.responsable && (equipo.responsable.nombre + '' + equipo.responsable.apellido).toLowerCase().includes(term)
    );
  }
  return [];
}


  
}  
