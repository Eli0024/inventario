import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
  equipoSeleccionado: any = {};
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

  // equipoSeleccionado: Equipo = {
  //   id_equipo: 0,
  //   marca: '',
  //   memoria: '',
  //   procesador: '',
  //   office: '',
  //   serial: '',
  //   serial_office: '',
  //   sistema_operativo: '',
  //   fecha_adquisicion: '',
  //   estado: '',
  //   responsable: null,
  //   archivo: null,
  // };

  constructor(
    private computersService: ComputersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getEquipos();
  }
  getEquipos(): void {
    this.computersService.getAll().subscribe((data: any) => {
      this.equipos = data;
    });
  }

  editarEquipo(equipo: any) {
    this.equipoSeleccionado = { ...equipo };
    console.log("Equipo para editar:", this.equipoSeleccionado);  // Verifica aquí
    this.cdr.detectChanges();  // Asegura que la vista se actualice
  }
  
  

  guardarEquipo() {
    // Aquí puedes implementar la lógica para guardar los cambios.
    // Puedes emitir un evento hacia el componente padre o llamar a un servicio para actualizar el equipo en la base de datos.
    console.log('Datos guardados:', this.equipoSeleccionado);
  }

  update(): void {
    this.computersService.update(this.equipo).subscribe(
      () => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Registro Actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/info']);
      },
      (error) => {
        Swal.fire({
          title: 'Error al actualizar',
          text: error.message,
          icon: 'error',
        });
      }
    );
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
