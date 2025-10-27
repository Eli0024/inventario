import { ChangeDetectorRef, Component, OnInit,EventEmitter,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { ComputersService } from '../services/computers.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Colaborador } from '../models/users';
import { UsersService } from '../services/users.service';
import { Equipo } from '../models/computer';
import { Authservice } from '../auth.service';

@Component({
  selector: 'app-formcomp',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, SidebarComponent, ReactiveFormsModule],
  templateUrl: './formcomp.component.html',
  styleUrls: ['./formcomp.component.css']
})
export class FormcompComponent implements OnInit {
  equipo: Equipo = {
    responsable: { id: 0, nombre: '', apellido: '' },
    id: 0,
    marca: '',
    modelo: '',
    memoria: '',
    procesador: '',
    office: '',
    serial: '',
    sistema_operativo: '',
    fecha_adquisicion: '',
    estado: '',
    archivo: null
  };

  colaboradores: Colaborador[] = [];
  equipos: Equipo[] = [];
  fileError: string = '';
  isSubmitting: boolean = false;
  today: Date = new Date();
  
  mostrarTodos: boolean = false;
  empresaActualId: number | null = null;

  
 
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<any>();
  
  constructor(
    private computersService: ComputersService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: Authservice
  ) { }

  ngOnInit(): void {
    this.cargar();
    this.loadColaboradores();
    this.loadEmpresaActual();
  }


  loadColaboradores(): void {
    this.usersService.getAllGlobal().subscribe({
      next: (data) => {
        this.colaboradores = data;
      },
      error: (err) => console.error('Error al cargar colaboradores:', err)
    });
  }

  loadEmpresaActual(): void {

    this.empresaActualId = this.authService.getEmpresaId(); 
  }


  get colaboradoresFiltrados(): Colaborador[] {
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

  cargar(): void {
    this.computersService.getEquipos().subscribe(
      (equipos) => {
        this.equipos = equipos;
      },
      (error) => {
        console.error('Error al cargar los equipos:', error);
      }
    );
  }

  getNombreResponsable(id: number): string {
    const colab = this.colaboradores.find(c => c.id === id);
    return colab ? `${colab.nombre} ${colab.apellido}` : 'No encontrado';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        this.fileError = 'Solo se permiten archivos JPG, PNG o PDF';
        this.equipo.archivo = null;
        input.value = '';
        return;
      }
      
    
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = 'El archivo no debe exceder 5MB';
        this.equipo.archivo = null;
        input.value = '';
        return;
      }
      
      this.fileError = '';
      this.equipo.archivo = file;
      this.cdr.detectChanges();
    } else {
      this.fileError = '';
      this.equipo.archivo = null;
    }
  }

  create(): void {

    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    // Crear FormData
    const formData = new FormData();
    formData.append('marca', this.equipo.marca);
    formData.append('modelo', this.equipo.modelo);
    formData.append('memoria', this.equipo.memoria);
    formData.append('procesador', this.equipo.procesador);
    formData.append('office', this.equipo.office);
    formData.append('serial', this.equipo.serial);
    formData.append('sistema_operativo', this.equipo.sistema_operativo);
    formData.append('fecha_adquisicion', this.equipo.fecha_adquisicion);
    formData.append('estado', this.equipo.estado);
    formData.append('responsable_id', this.equipo.responsable.id.toString());

    if (this.equipo.archivo) {
      formData.append('archivo', this.equipo.archivo, this.equipo.archivo.name);
    }

    this.computersService.create(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        Swal.fire({
          title: '¡Éxito!',
          text: 'Equipo registrado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.created.emit(response); 
        this.resetForm();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error completo:', err);
        console.error('Detalles del error:', err.error);
        Swal.fire({
          title: 'Error',
          text: err.error?.message || 'Error al registrar equipo',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    });
  }

  cerrar(): void {
  this.close.emit();
}


  private validateForm(): boolean {
    // Validar campos requeridos
    const requiredFields = [
      { field: this.equipo.marca, name: 'Marca' },
      { field: this.equipo.modelo, name: 'Modelo' },
      { field: this.equipo.memoria, name: 'Memoria' },
      { field: this.equipo.procesador, name: 'Procesador' },
      { field: this.equipo.office, name: 'Office' },
      { field: this.equipo.serial, name: 'Serial' },
      { field: this.equipo.sistema_operativo, name: 'Sistema Operativo' },
      { field: this.equipo.fecha_adquisicion, name: 'Fecha de adquisición' },
      { field: this.equipo.estado, name: 'Estado' }
    ];

    for (const item of requiredFields) {
      if (!item.field || (typeof item.field === 'string' && item.field.trim() === '')) {
        Swal.fire('Error', `El campo "${item.name}" es requerido`, 'error');
        return false;
      }
    }

    // Validar responsable
    if (!this.equipo.responsable?.id || this.equipo.responsable.id === 0) {
      Swal.fire('Error', 'Debe seleccionar un responsable', 'error');
      return false;
    }

    // Validar fecha no futura
    const fechaAdq = new Date(this.equipo.fecha_adquisicion);
    const hoy = new Date();
    if (fechaAdq > hoy) {
      Swal.fire('Error', 'La fecha de adquisición no puede ser futura', 'error');
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.equipo = {
      id:0,
      responsable: { id: 0, nombre: '', apellido: '' },
      marca: '',
      modelo: '',
      memoria: '',
      procesador: '',
      office: '',
      serial: '',
      sistema_operativo: '',
      fecha_adquisicion: '',
      estado: '',
      archivo: null
    };
    this.fileError = '';
    
    // Resetear el input de archivo visualmente
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}