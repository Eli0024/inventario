import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersService } from '../services/users.service';
import { ComputersService } from '../services/computers.service';
import { LicenceService } from '../services/licence.service';
import { Colaborador } from '../models/users';
import { Equipo } from '../models/computer';
import { Licence } from '../models/licence';
import { ContentComponent } from '../content/content.component';
import { Mantenimiento } from '../models/manten';
import { Periferico } from '../models/perife';
import { MantenService } from '../services/manten.service';
import { PerifeService } from '../services/perife.service';

@Component({
  selector: 'app-vermas',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, RouterLink, ContentComponent],
  templateUrl: './vermas.component.html',
  styleUrl: './vermas.component.css'
})
export class VermasComponent implements OnInit {

  colaborador: Colaborador = {
    id: 0,
    nombre: '',
    apellido: '',
    empresa: null,
    area: null,
    cargo: '',
  };

  equipo: Equipo ={
    id: 0,
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
  
  licence : Licence = {
    id: 0,
    correo: '',
    contrasena: '',
    serial_office: '',
  };

  mantenimiento : Mantenimiento = {
    responsable: { // Objeto Responsable por defecto
      nombre: '',
      apellido: ''
    },
    id: 0,
    equipo: '',
    fecha: '',
    tipo: '',
    descripcion: '',
  }

  periferico : Periferico = {
    responsable: { // Objeto Responsable por defecto
      nombre: '',
      apellido: ''
    },
    id: 0,
    nombre: '',
    modelo: '',
    numero_serie: '',
    fecha_adquisicion: '',
  }

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private computersService: ComputersService,
    private licenceService: LicenceService,
    private mantenService: MantenService,
    private perifeService: PerifeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener el ID de la URL
    if (id) {
      this.cargarDatosColaborador(id);
      this.cargarDatosEquipoPorColaborador(id); // Usar el mismo ID para cargar el equipo
      this.cargarDatosLicencia(id);
      this.cargarDatosMantenimiento(id);
      this.CargarDatosPeriferico(id);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      this.equipo.archivo = file;
    }
  }

  cargarDatosColaborador(id: string) {
    this.usersService.getColaboradorById(id).subscribe((data) => {
      this.colaborador = data;
    });
  }

  cargarDatosEquipoPorColaborador(idColaborador: string) {
    this.computersService.getEquipoPorColaborador(idColaborador).subscribe(
      (data) => {
        if (data) {
          this.equipo = data;  // Asigna los datos del equipo
        } else {
          console.warn('No se encontró ningún equipo para este colaborador.');
          this.equipo = {
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
            responsable: {
              nombre: '',
              apellido: ''
            },
            archivo: null
          }; // Inicializar con valores por defecto
        }
      },
      (error) => {
        if (error.status === 404) {
          alert('No se encontró ningún equipo para este colaborador.');
        } else {
          console.error('Error al obtener el equipo:', error);
          alert('Ocurrió un error al cargar los datos del equipo.');
        }
      }
    );
  }

  cargarDatosLicencia(id: string) {
    this.licenceService.getLicenciaById(id).subscribe((data) => {
      this.licence = data;
    });
  }

  cargarDatosMantenimiento(id: string) {
    this.mantenService.getMantenimientoById(id).subscribe((data) => {
      this.mantenimiento = data;
    });
  }

  CargarDatosPeriferico(id: string) {
    this.perifeService.getPerifericoById(id).subscribe((data) => {
      this.periferico = data;
    });
  }
}
