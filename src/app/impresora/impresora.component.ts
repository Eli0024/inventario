import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ImprerService } from '../services/imprer.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormimpreComponent } from '../formimpre/formimpre.component';
import { Router, RouterLink } from '@angular/router';
import { MantenimprerComponent } from '../mantenimprer/mantenimprer.component';
import { Impresora } from '../models/imprer';

@Component({
  selector: 'app-impresora',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    NavbarComponent, 
    SidebarComponent, 
    FormimpreComponent, 
    RouterLink, 
    MantenimprerComponent
  ],
  templateUrl: './impresora.component.html',
  styleUrl: './impresora.component.css'
})
export class ImpresoraComponent implements OnInit {
  impresoras: Impresora[] = [];
  filter: any = { searchTerm: '' };
  impresora: Impresora = {
    id: 0,
    nombre: '',
    direccion_ip: '',
  };

  impresoraSeleccionado: Impresora = {
    id: 0,
    nombre: '',
    direccion_ip: '',
  };
  
  modalImpresoraAbierto: boolean = false;
  modalMantenimientoAbierto: boolean = false;

  modalEdicionAbierto: boolean = false;
   
  constructor(
    private imprerService: ImprerService, 
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadImpresoras();
  }

  loadImpresoras(): void {
    this.imprerService.getAll().subscribe(
      (response: Impresora[]) => {
        this.impresoras = response;
      },
      (error: any) => {
        console.error('Error al obtener las impresoras', error);
      }
    );
  }

  //MODAL DE REGISTRO IMPRESORA
  openImpresoraModal(): void {
    this.modalImpresoraAbierto = true;
  }

  closeImpresoraModal(): void {
    this.modalImpresoraAbierto = false;
  }

  onImpresoraCreada(impresora: any): void {
  this.modalImpresoraAbierto = false;
  this.loadImpresoras(); 
}

  //MODAL DE REGISTRO MANTENIMIENTO IMPRESORA

  openMantenimientoModal(): void {
    this.modalMantenimientoAbierto = true;
  }

  closeMantenimientoModal(): void {
    this.modalMantenimientoAbierto = false;
  }

  onMantenimientoCreado(mantenimiento: any): void {
  this.modalMantenimientoAbierto = false; 
}

  //MODAL DE EDICION
  editarImpresora(impresora: Impresora): void {
    this.impresoraSeleccionado = { ...impresora };
    this.openModal();
  }

  openModal(): void {
    this.modalEdicionAbierto = true;
  }

  closeModal(): void {
    this.modalEdicionAbierto = false;
  }
  
  update(): void {
    if (this.impresoraSeleccionado && this.impresoraSeleccionado.id) {
      this.imprerService.update(this.impresoraSeleccionado).subscribe(
        (response: Impresora) => {
          console.log('Impresora actualizada', response);
          this.loadImpresoras();
          this.closeModal();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Impresora actualizada",
            showConfirmButton: false,
            timer: 1500
          });
        },
        (error: any) => {
          console.error('Error al actualizar la impresora', error);
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al actualizar la impresora",
            icon: "error"
          });
        }
      );
    }
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
        this.imprerService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              title: "¡Eliminado!",
              text: "El registro ha sido eliminado.",
              icon: "success"
            });
            this.loadImpresoras();
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

  filterImpresoras(): Impresora[] {
    if (this.impresoras && this.impresoras.length) {
      return this.impresoras.filter(impresora =>
        impresora.nombre.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
        impresora.direccion_ip.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
      );
    }
    return [];
  }
}