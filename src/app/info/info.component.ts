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
  filter: any = { searchTerm: '' };
  equipo: Equipo = {
    id_equipo: 0,
    marca: '',
    memoria: '',
    procesador: '',
    office: '',
    serial: '',
    serial_office: '',
    sistema_operativo: '',
    fecha_adquisicion: '',
    estado: '',
    responsable: null, // O el valor adecuado si tienes un objeto 'Responsable'
    archivo: null,
  };

   equipoSeleccionado: Equipo = {
    id_equipo: 0,  // Type assertion (unsafe, but works)
     marca: '',
     memoria: '',
     procesador: '',
     office: '',
     serial: '',
     serial_office: '',
     sistema_operativo: '',
     fecha_adquisicion: '',
     estado: '',
     responsable: null,
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

  delete(id_equipo: number) {
    console.log(id_equipo);

    Swal.fire({
      title: '¿Desea eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡elimínalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.computersService.delete(id_equipo).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El registro ha sido eliminado.',
              icon: 'success',
            });
            this.ngOnInit(); // Actualiza la vista
          },
          error: (err) => {
            console.error('Error:', err);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar el registro.',
              icon: 'error',
            });
          },
        });
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
            .includes(this.filter.searchTerm.toLowerCase()) ||
          Equipo.responsable
            .toLowerCase()
            .includes(this.filter.searchTerm.toLowerCase())
      );
    }
    return [];
  }
}
