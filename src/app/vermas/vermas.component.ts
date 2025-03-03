import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
import { ComputersService } from '../services/computers.service';
import { LicenceService } from '../services/licence.service';
import { Colaborador } from '../models/users';
import { Equipo } from '../models/computer';
import { Licence } from '../models/licence';

@Component({
  selector: 'app-vermas',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent],
  templateUrl: './vermas.component.html',
  styleUrl: './vermas.component.css'
})
export class VermasComponent implements OnInit {

  colaborador: Colaborador = {
    id_colaborador: 0,
    nombre: '',
    apellido: '',
    empresa: null,
    area: null,
    cargo: '',
    licencia: null,
  };

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
  
  licence : Licence = {
    id_licencia: 0,
    correo: '',
    contrasena: '',
    serial_office: '',
  };

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private computersService: ComputersService,
    private licenceService: LicenceService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener el ID de la URL
    if (id) {
      this.cargarDatosColaborador(id);
      this.cargarDatosEquipo(id);
      this.cargarDatosLicencia(id);
    }
  }

  cargarDatosColaborador(id: string) {
    this.usersService.getColaboradorById(id).subscribe((data) => {
      this.colaborador = data;
    });
  }

  cargarDatosEquipo(id: string) {
    this.computersService.getEquipoById(id).subscribe((data) => {
      this.equipo = data;
    });
  }

  cargarDatosLicencia(id: string) {
    this.licenceService.getLicenciaById(id).subscribe((data) => {
      this.licence = data;
    });
  }
}
