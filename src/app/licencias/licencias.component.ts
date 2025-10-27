import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LicenceService } from '../services/licence.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormoffComponent } from '../formoff/formoff.component';
import { Licence } from '../models/licence';
import { Colaborador } from '../models/users';
import { UsersService } from '../services/users.service';
import { Equipo } from '../models/licence';
import { ComputersService } from '../services/computers.service';


@Component({
  selector: 'app-licencias',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent, SidebarComponent, FormoffComponent, RouterLink],
  templateUrl: './licencias.component.html',
  styleUrls: ['./licencias.component.css']
})
export class LicenciasComponent implements OnInit {

  licencias: Licence[] = [];
  colaboradores:Colaborador[] = [];
  equipos:Equipo[]=[];


  licenceSeleccionado: Licence = {
    id: 0,
    tipo_licencia: '',
    correo: '',
    contrasena: '',
    clave_producto: '',
    fecha_compra:'',
    equipo: {
    id: 0, 
    marca: '', 
    serial: '',
    responsable:undefined},
    equipo_id:undefined
  };

  modalAbierto = false;
  modoEdicion=false;
  filter = {
    searchTerm: ''
  };
  modalRegistroAbierto=false;
   isProject2019 = false;

  constructor(
    private licenceService: LicenceService,
    private userService:UsersService,
    private computersService:ComputersService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarLicencias();
    this.cargarEquipos();
  }

  openRegistroModal(): void {
  this.modoEdicion = false;
  this.modalRegistroAbierto = true;
 }

  cargarLicencias(): void {
    this.licenceService.getAll().subscribe({
      next: (data) => {
        this.licencias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar licencias:', err)
    });
  }

  cargarColaboradores():void {
    this.userService.getAll().subscribe({
      next:(data)=>{
        this.colaboradores=data;
      },
      error:(err)=>console.error('error al cargar colaboradores:',err)
    });
  }

  cargarEquipos(): void {
    this.computersService.getEquipos().subscribe({
      next: (data) => {
        this.equipos = data;
      },
      error: (err) => console.error('Error al cargar equipos:', err)
    });
  }

 
 onLicenceCreada(nuevaLicencia: Licence): void {
  this.closeModal();
  this.cargarLicencias();
  Swal.fire('Exito','Licencia registarda corectamente','success');
  this.modalRegistroAbierto=false;
 }

 


  openModalAndEdit(licence: Licence): void {
    this.modoEdicion = true;
    this.licenceSeleccionado = {
      ...licence,
      equipo_id: licence.equipo?.id ?? undefined
    };
    this.modalAbierto = true;
      this.isProject2019 = this.licenceSeleccionado.tipo_licencia === 'project_2019';
  }

  onTipoChange(): void {
    this.isProject2019 = this.licenceSeleccionado.tipo_licencia === 'project_2019';

    if (this.isProject2019) {
      this.licenceSeleccionado.correo = null;
      this.licenceSeleccionado.contrasena = null;
    }
  }

  closeModal(): void {
    this.modalAbierto = false;
    this.modalRegistroAbierto = false;
    this.licenceSeleccionado = {
      id: 0,
      tipo_licencia: '',
      correo: '',
      contrasena: '',
      clave_producto: '',
      fecha_compra: '',
      equipo: { id: 0, marca: '', serial: '', responsable: undefined },
      equipo_id: undefined 
    };
  }

  update(): void {
    if (!this.licenceSeleccionado.equipo_id) {
      Swal.fire('Error', 'Debe seleccionar un equipo válido', 'error');
      return;
    }

    if (this.licenceSeleccionado.tipo_licencia === 'project_2019') {
      this.licenceSeleccionado.correo = null;
      this.licenceSeleccionado.contrasena = null;
    }

    this.licenceService.update(this.licenceSeleccionado)
      .subscribe({
        next: () => {
          Swal.fire('Éxito', 'Licencia actualizada correctamente', 'success');
          this.closeModal();
          this.cargarLicencias();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire('Error', 'Ocurrió un error al actualizar la licencia', 'error');
        }
      });
  }

  delete(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.licenceService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La licencia ha sido eliminada', 'success');
            this.cargarLicencias();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar la licencia', 'error');
          }
        });
      }
    });
  }
  
  getNombreResponsable(id: number): string {
    const colab = this.colaboradores.find(c => c.id === id);
    return colab ? `${colab.nombre} ${colab.apellido}` : 'No encontrado';
  }

  getResponsableFromEquipo(licence: Licence): string {
    if (licence.equipo && licence.equipo.responsable) {
      const responsable = licence.equipo.responsable;
      return `${responsable.nombre} ${responsable.apellido}`;
    }
    return 'Sin responsable';
  }

  filterLicences(): Licence[] {
  if (!this.licencias || !this.licencias.length) return [];
  
  const term = this.filter.searchTerm.toLowerCase().trim();

  if (!term) return this.licencias;

  return this.licencias.filter(licence =>
    licence.tipo_licencia?.toLowerCase().includes(term) ||
    licence.correo?.toLowerCase().includes(term) ||
    licence.contrasena?.toLowerCase().includes(term) ||
    licence.clave_producto?.toLowerCase().includes(term) ||
    licence.fecha_compra?.toLowerCase().includes(term) ||
    licence.equipo?.marca?.toLowerCase().includes(term) ||
    licence.equipo?.serial?.toLowerCase().includes(term) ||
    (licence.equipo?.responsable &&
      (licence.equipo?.responsable.nombre + ' ' + licence.equipo?.responsable.apellido)
        .toLowerCase()
        .includes(term))
  );
}

}