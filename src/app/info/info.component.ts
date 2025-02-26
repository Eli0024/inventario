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
    id_equipo: 0,
    marca: '',
    memoria: '',
    modelo: '',
    procesador: '',
    office: '',
    serial: '',
    windows: '',
    sistema_operativo: '',
    fecha_adquisicion: '',
    estado: '',
    responsable: { // Objeto Responsable por defecto
      nombre: '',
      apellido: ''
    },
    archivo: null
  };
  // Ejemplo en el componente

   equipoSeleccionado: Equipo = {
    id_equipo: 0,  // Type assertion (unsafe, but works)
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
     responsable: { // Objeto Responsable por defecto
      nombre: '',
      apellido: ''
    },
     archivo: null,
   };


  constructor(
    private computersService: ComputersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getEquipos();
    this.loadEquipos();
    
  }
  getEquipos(): void {
    this.computersService.getEquipos().subscribe((data: any) => {
      this.equipos = data;
    });
  }



  editarEquipo(equipo: any) {
    this.equipoSeleccionado = { ...equipo };
    this.equipo = { ...equipo }; // También actualizamos 'this.equipo'
    this.cdr.detectChanges();  // Asegura que la vista se actualice
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

  // Cierra el modal
  closeModal(): void {
    this.modalAbierto = false;
  }

  // Actualizar el equipo
  update(): void {
    if (this.equipoSeleccionado) {
      this.computersService.update(this.equipoSeleccionado).subscribe(
        (response: Equipo) => {
          console.log('Equipo actualizado', response);
          this.loadEquipos(); // Recargar los equipos
          this.closeModal(); // Cerrar el modal
        },
        (error: any) => {
          console.error('Error al actualizar equipo', error);
        }
      );
    }
  }
              

  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      this.equipo.archivo = file;
    }
  }

  delete(id: number) {
    this.computersService.delete(id).subscribe(
      () => {
        alert('Equipo eliminado correctamente');
        // Aquí puedes actualizar la lista de equipos
      },
      (error) => {
        if (error.status === 403) {
          alert('No tienes permisos para eliminar este equipo');
        } else {
          alert('Error al eliminar el equipo');
        }
        console.error(error);
      }
    );
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
