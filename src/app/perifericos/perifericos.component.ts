import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerifeService } from '../services/perife.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormperiComponent } from '../formperi/formperi.component';
import { Periferico } from '../models/perife';
import { UsersService } from '../services/users.service';
import { Colaborador } from '../models/users';

@Component({
  selector: 'app-perifericos',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    NavbarComponent, 
    SidebarComponent, 
    FormperiComponent, 
    RouterLink
  ],
  templateUrl: './perifericos.component.html',
  styleUrls: ['./perifericos.component.css']
})
export class PerifericosComponent implements OnInit {
  perifericos: Periferico[] = [];
  colaboradores: Colaborador[] = [];
  perifericoSeleccionado: Periferico = {
    id: 0,
    nombre: '',
    modelo: '',
    numero_serie: '',
    fecha_adquisicion: '',
    responsable: { 
      id: 0,
      nombre: '',
      apellido: '' 
    },
    responsable_id:0
  };
  modalRegistroAbierto = false;
  modalEdicionAbierto=false;

  filter = {
    searchTerm: ''
  };

  constructor(
    private perifeService: PerifeService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPerifericos();
    this.cargarColaboradores();
  }

  cargarPerifericos(): void {
    this.perifeService.getAll().subscribe({
      next: (data) => {
        this.perifericos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar periféricos:', err)
    });
  }

  openRegistroModal(): void {
    this.modalRegistroAbierto = true;
  }

  closeRegistroModal(): void {
    this.modalRegistroAbierto = false;
  } 

  onPerifericoCreado(response: Periferico): void {
    this.perifericos.push(response);
    this.cargarPerifericos();   
  }

  onFormularioCancelado():void{
    this.modalRegistroAbierto=false
  }

  abrirModalEdicion(periferico: Periferico): void {
    this.perifericoSeleccionado = { ...periferico }; 
    this.modalEdicionAbierto = true;
  }

  cargarColaboradores(): void {
    this.usersService.getAll().subscribe({
      next: (data) => {
        this.colaboradores = data;
      },
      error: (err) => console.error('Error al cargar colaboradores:', err)
    });
  }

  
  openModalAndEdit(periferico: Periferico): void {
    this.perifericoSeleccionado = {...periferico};
    this.modalEdicionAbierto = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.modalEdicionAbierto = false;
    this.perifericoSeleccionado = {
      id: 0,
      nombre: '',
      modelo: '',
      numero_serie: '',
      fecha_adquisicion: '',
      responsable: { 
        id: 0,
        nombre: '',
        apellido: '' 
      },
      responsable_id:0
    };
  }

  update(): void {
    if (!this.perifericoSeleccionado.responsable?.id) {
      Swal.fire('Error', 'Debe seleccionar un responsable válido', 'error');
      return;
    }

    this.perifeService.update(
      this.perifericoSeleccionado.id,
      this.perifericoSeleccionado
    )
      .subscribe({
        next: (updated) => {
          const index = this.perifericos.findIndex(p => p.id === updated.id);
        if (index !== -1) {
          this.perifericos[index] = updated;
        }
          Swal.fire('Éxito', 'Periférico actualizado correctamente', 'success');
          this.closeModal();
          this.cargarPerifericos();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire('Error', 'Ocurrió un error al actualizar el periférico', 'error');
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
        this.perifeService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El periférico ha sido eliminado', 'success');
            this.cargarPerifericos();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el periférico', 'error');
          }
        });
      }
    });
  }

  filterPerifericos(): Periferico[] {
    if (!this.filter.searchTerm) return this.perifericos;

    const term = this.filter.searchTerm.toLowerCase().trim();
    if (!term) return this.perifericos; 
    
    const searchTerm = this.filter.searchTerm.toLowerCase();
    return this.perifericos.filter(periferico => {
      return periferico.nombre?.toLowerCase().includes(searchTerm) ||
             periferico.modelo?.toLowerCase().includes(searchTerm) ||
             periferico.numero_serie?.toLowerCase().includes(searchTerm) ||
             periferico.fecha_adquisicion?.toLowerCase().includes(term) ||
             periferico?.responsable?.nombre?.toLowerCase().includes(searchTerm) ||
             periferico?.responsable?.apellido?.toLowerCase().includes(searchTerm);
    });
  }

  getNombreResponsable(id: number): string {
    const colab = this.colaboradores.find(c => c.id === id);
    return colab ? `${colab.nombre} ${colab.apellido}` : 'No encontrado';
  }
}