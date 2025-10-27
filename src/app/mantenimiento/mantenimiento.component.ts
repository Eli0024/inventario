import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Mantenimiento } from '../models/manten';
import { MantenService } from '../services/manten.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormmanteComponent } from '../formmante/formmante.component';
import { Router, RouterLink } from '@angular/router';
import { Colaborador } from '../models/users';
import { UsersService } from '../services/users.service';
import { ComputersService } from '../services/computers.service';
import { Equipo } from '../models/manten';

@Component({
  selector: 'app-mantenimiento',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NavbarComponent, 
    SidebarComponent, 
    FormmanteComponent, 
    RouterLink
  ],
  templateUrl: './mantenimiento.component.html',
  styleUrl: './mantenimiento.component.css'
})
export class MantenimientoComponent implements OnInit {
  mantenimientos: Mantenimiento[] = [];
  equipos:  Equipo[] = [];
  colaboradores: Colaborador[] = [];
  modalAbierto: boolean = false;
  filter: any = { searchTerm: '' };

  modalMantenimientoAbierto:boolean=false


  mantenimientoSeleccionado: Mantenimiento = {
    id: 0,
    equipo:{ 
    id: 0,
    marca:'',
    serial:'',
    responsable:{
      id:0,
      nombre:'',
      apellido:''
    }

  },
    equipo_id: 0,
    fecha_mantenimiento:'',
    tipo_mantenimiento: 'preventivo',
    tipo_servicio: 'software',
    descripcion: '',
    realizado_por: '',
  };

  constructor(
    private mantenService: MantenService,
    private computersService: ComputersService, 
    private cdr: ChangeDetectorRef,
    private router: Router,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.loadMantenimientos();
     this.loadEquipos();
    this.loadColaboradores();
  }

  cargarMantenimientos(): void {
    this.mantenService.getAll().subscribe({
      next: (response) => this.mantenimientos = response,
      error: (error) => console.error('Error al obtener mantenimientos', error)
    });
  }
  
  openMantenimientoModal(){
    this.modalMantenimientoAbierto=true;
  }

  closeMantenimientoModal(){
    this.modalMantenimientoAbierto=false
  }

  onMantenimientoCreado(): void {
    this.modalMantenimientoAbierto = false; 
    this.cargarMantenimientos(); 
  }

  // Evento cuando se cancela el formulario
  onFormularioCancelado(): void {
    this.modalMantenimientoAbierto = false;
  }

  loadMantenimientos(): void {
    this.mantenService.getAll().subscribe(
      (response: Mantenimiento[]) => {
        this.mantenimientos = response;
      },
      (error: any) => {
        console.error('Error al obtener los mantenimientos', error);
      }
    );
  }

  loadEquipos(): void {
    this.computersService.getEquipos().subscribe({
      next: (response: Equipo[]) => {
        this.equipos = response;
      },
      error: (err) => console.error('Error al cargar equipos', err)
    });
  }

  loadColaboradores(): void {
    this.usersService.getAll().subscribe(
      (response: Colaborador[]) => {
        this.colaboradores = response;
      },
      (error: any) => {
        console.error('Error al obtener los colaboradores', error);
      }
    );
  }

  verCalendario(){
    this.router.navigate(['/calendario'])
  }

  openModalAndEdit(mantenimiento: Mantenimiento): void {
     this.mantenimientoSeleccionado = {
      ...mantenimiento,
      equipo: mantenimiento.equipo
        ? { ...mantenimiento.equipo }
        : { id: 0, marca: '', serial: '', responsable: {id:0,nombre:'',apellido:''} },
      equipo_id: mantenimiento.equipo?.id || 0
    };
    this.modalAbierto = true;
  }
  
  openModal(): void {
    this.modalAbierto = true;
  }
  
  closeModal(): void {
    this.modalAbierto = false;
  }

  update(): void {
    if (!this.mantenimientoSeleccionado.equipo_id) {
      Swal.fire('Error', 'Debe seleccionar un equipo', 'error');
      return;
    }
  
    this.mantenService.update(this.mantenimientoSeleccionado).subscribe({
      next: (response) => {
        Swal.fire({
          title: "¡Actualizado!",
          text: "El mantenimiento ha sido actualizado",
          icon: "success"
        });
        this.loadMantenimientos();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al actualizar el mantenimiento",
          icon: "error"
        });
      }
    });
  }
  
  delete(id: number) {
    Swal.fire({
      title: "¿Desea eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡elimínalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.mantenService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              title: "¡Eliminado!",
              text: "El registro ha sido eliminado.",
              icon: "success"
            });
            this.loadMantenimientos();
          },
          error: (err) => {
            console.error('Error:', err);
            Swal.fire({
              title: "Error",
              text: "Hubo un problema al eliminar el registro.",
              icon: "error"
            });
          }
        });
      }
    });
  }

  filterMantenimientos(): Mantenimiento[] {
    if (this.mantenimientos && this.mantenimientos.length) {
       return this.mantenimientos.filter(m =>
      m.equipo?.marca.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
      m.equipo?.serial.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
      m.descripcion.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
      m.tipo_mantenimiento.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
      (m.equipo?.responsable?.nombre.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ?? false)
    );
    }
    return [];
  }

  getNombreResponsable(id: number): string {
    const colab = this.colaboradores.find(c => c.id === id);
    return colab ? `${colab.nombre} ${colab.apellido}` : 'No asignado';
  }
}