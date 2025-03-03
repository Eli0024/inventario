import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
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


@Component({
  selector: 'app-formcomp',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, SidebarComponent, ReactiveFormsModule], 
  templateUrl: './formcomp.component.html',
  styleUrl: './formcomp.component.css'
})
export class FormcompComponent {

 
  equipo: Equipo = {
    responsable: { nombre: '', apellido: '' },
    id_equipo: 0,
    marca: '',
    modelo: '',
    memoria: '',
    procesador: '',
    office: '',
    serial: '',
    windows: '',
    sistema_operativo: '',
    fecha_adquisicion: '',
    estado: '',
    archivo: null
  };

  

  colaborador: Colaborador = {
      id_colaborador: 0,
      nombre: '',
      apellido: '',
      empresa: null,
      area: null,
      cargo: '',
      licencia: null,
    };
    

  responsables: any[] = [];
  colaboradores: Colaborador[] = [];
  
  @Input() equipoSeleccionado: any;


  equipos: Equipo[] = [];
 

  constructor(private computersService: ComputersService, private usersService: UsersService, private router: Router, private activatedRoute:ActivatedRoute,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargar();
    this.loadUsuarios();
    this.loadEquipos();
   }

   loadUsuarios(): void {
    this.usersService.getAll().subscribe(
      (response: Colaborador[]) => {
        this.colaboradores = response;
      },
      (error: any) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
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

  getEquipos(): void {
    this.computersService.getEquipos().subscribe((data: any) => {
      this.equipos = data;
    });
  }

  // Método para manejar el evento "equipoCreado"
  onEquipoCreado(equipo: Equipo): void {
    this.equipos.push(equipo);  // Agregar el nuevo equipo a la lista
  }

  modalAbierto1: boolean = false; 

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
  openModal1(): void {
    this.modalAbierto1 = true;
  }

  closeModal1(): void {
    this.modalAbierto1 = false;
  }


  create(): void {
    console.log('Equipo a crear:', this.equipo);

    this.computersService.create(this.equipo).subscribe(
      (nuevoEquipo) => {
        console.log('Equipo creado:', nuevoEquipo);
        Swal.fire('¡Creado!', 'El equipo ha sido creado correctamente.', 'success');

        // Crear un nuevo arreglo para que Angular detecte el cambio
        this.equipos = [...this.equipos, nuevoEquipo];
        console.log('Lista de equipos actualizada:', this.equipos);

        // Marcar el componente para verificación de cambios
        this.cdr.markForCheck();

        // Reiniciar el formulario
        this.equipo = {
          responsable: { nombre: '', apellido: '' },
          id_equipo: 0,
          marca: '',
          modelo: '',
          memoria: '',
          procesador: '',
          office: '',
          serial: '',
          windows: '',
          sistema_operativo: '',
          fecha_adquisicion: '',
          estado: '',
          archivo: null
        };

        // Cerrar el modal
        this.closeModal1();
      },
      (error) => {
        console.error('Error al crear el equipo:', error);
        Swal.fire('Error', 'Ocurrió un error al crear el equipo.', 'error');
      }
    );
  }


  guardarEquipo() {
    // Aquí puedes implementar la lógica para guardar los cambios.
    // Puedes emitir un evento hacia el componente padre o llamar a un servicio para actualizar el equipo en la base de datos.
    console.log("Datos guardados:", this.equipoSeleccionado);
  } 

  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      this.equipo.archivo = file;
    }
  }
}
  