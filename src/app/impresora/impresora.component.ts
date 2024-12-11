import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Impresora } from '../models/imprer';
import { ImprerService } from '../services/imprer.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormimpreComponent } from '../formimpre/formimpre.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-impresora',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent, SidebarComponent, FormimpreComponent, RouterLink],
  templateUrl: './impresora.component.html',
  styleUrl: './impresora.component.css'
})
export class ImpresoraComponent implements OnInit {

  impresoras : Impresora[] = []; // inicializa con un array vacío
  filter: any = { searchTerm: '' };
  impresora : Impresora = {
    id: 0,
    nombre: '',
    ip: '',
  };

  impresoraSeleccionado: Impresora = {
    id: 0,
    nombre: '',
    ip: '',
   };
   
  constructor(private imprerService: ImprerService, private cdr: ChangeDetectorRef) {  }

  ngOnInit(): void {
    this.loadImpresoras();
    }
    
    editarImpresora(impresora: any) {
      this.impresoraSeleccionado = { ...impresora };
      this.impresora = { ...impresora };
      this.cdr.detectChanges();
    }
    

    modalAbierto: boolean = false; 

  loadImpresoras(): void {
    this.imprerService.getAll().subscribe(
      (response: Impresora[]) => {
        this.impresoras = response;
      },
      (error: any) => {
        console.error('Error al obtener los usuarios', error);
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
  
  update(): void {
    if (this.impresoraSeleccionado && this.impresoraSeleccionado.id) {  // Asegúrate de que el id esté presente
      this.imprerService.update(this.impresoraSeleccionado).subscribe(
        (response: Impresora) => {
          console.log('Licencia actualizada', response);
          this.loadImpresoras();  // Recargar las licencias
          this.closeModal();  // Cerrar el modal
        },
        (error: any) => {
          console.error('Error al actualizar la licencia', error);
        }
      );
    } else {
      console.error('El id de la licencia es necesario para actualizar.');
    }
  }
  
     
  
   delete(id: number) {
      console.log(id);
      
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
              this.ngOnInit(); // Actualiza la vista
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
        return this.impresoras.filter( Impresora =>
          Impresora.nombre.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) 
        );
      }
      return [];
    }
}
