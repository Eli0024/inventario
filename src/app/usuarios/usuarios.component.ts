import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Colaborador,Empresa } from '../models/users';
import { UsersService } from '../services/users.service';
import { EmpresaService } from '../services/empresa.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormuserComponent } from '../formuser/formuser.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, FormsModule, RouterLink, FormuserComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  colaboradores : Colaborador []=[];
  empresas : any[]=[];
  filter: any = { searchTerm: '' };

  colaborador: Colaborador = {
    id: 0,
    nombre: '',
    apellido: '',
    empresa: {id:0,nombre:''},
    empresa_id:0,
    area: null,
    cargo: '',
  };

  colaboradorSeleccionado: Colaborador = {
    id: 0,
    nombre: '',
    apellido: '',
    empresa: {id:0,nombre:''},
    empresa_id:0,
    area: null,
    cargo: '',
  };

  modalAbierto: boolean = false;
  modalRegistroAbierto:boolean=false;
   
  constructor(
    private usersService: UsersService, 
    private empresaService: EmpresaService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadColaboradores();
    this.loadEmpresas();
  }

  openRegistroModal(): void {
    this.modalRegistroAbierto = true;
  }

  closeRegistroModal(): void {
    this.modalRegistroAbierto = false;
  }

  onUsuarioCreado(usuario: any): void {
  this.modalRegistroAbierto = false;
  this.loadColaboradores();
}

  verMas(id: number): void {
    this.router.navigate(['/vermas', id]);
  }

  handleSubmit(colaborador: Colaborador): void {
    console.log('Usuario registrado desde el form:', colaborador);
    this.loadColaboradores(); // Actualiza la tabla
    this.closeBootstrapModal('userModal'); // Cierra el modal
  }

  handleCancel(): void {
    console.log('Registro cancelado');
    this.closeBootstrapModal('userModal');
  }

  closeBootstrapModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

  openModalAndEdit(colaborador: Colaborador): void {
    this.colaboradorSeleccionado = { ...colaborador };
    this.modalAbierto = true;
    this.cdr.detectChanges();
  }
  
  editarColaborador(colaborador: Colaborador): void {
    this.colaboradorSeleccionado = { ...colaborador };
    this.openModal(); 
    this.cdr.detectChanges();
  }
  
  openModal(): void {
    this.modalAbierto = true;
  }
  
  closeModal(): void {
    this.modalAbierto = false;
  }
 

  loadColaboradores(): void {
    this.usersService.getAll().subscribe(
      (response: Colaborador[]) => {
        this.colaboradores = response;
      },
      (error: any) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }

  loadEmpresas(): void {
  this.empresaService.getEmpresas().subscribe(
    (response: any[]) => this.empresas = response,
    (error: any) => console.error('Error al cargar empresas', error)
  );
}

  // Actualizar el usuario
  update(): void {
    if (this.colaboradorSeleccionado) {
      this.usersService.update(this.colaboradorSeleccionado).subscribe(
        ()=> {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Usuario actualizado',
            showConfirmButton: false,
            timer: 1500
          });
          this.loadColaboradores();
          this.closeModal();
        },
        (error: any) => {
          Swal.fire({
            title: 'Error al actualizar',
            text: error.message || 'Ocurrió un error al actualizar el usuario',
            icon: 'error'
          });
          
        }
      );
    }
  }
     
  delete(id: number) : void {
    
    Swal.fire({
      title: "¿Desea eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡elimínalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.delete(id).subscribe({
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

  filterColaboradores(): Colaborador[] {
  if (this.colaboradores && this.colaboradores.length) {
    const term = this.filter.searchTerm.toLowerCase();

    return this.colaboradores.filter(colaborador =>
      colaborador.nombre.toLowerCase().includes(term) ||
      colaborador.apellido.toLowerCase().includes(term) ||
      colaborador.area?.toLowerCase().includes(term) ||
      colaborador.cargo?.toLowerCase().includes(term)
    );
  }
  return [];
}


  onEmpresaChange(event: any) {
    console.log("Empresa seleccionada:", event);  // Aquí puedes realizar más acciones si lo deseas.
    this.colaboradorSeleccionado.empresa = event;
  }
  
  onAreaChange(event: any) {
    console.log("Area seleccionada:", event);  // Aquí puedes realizar más acciones si lo deseas.
    this.colaboradorSeleccionado.area = event;
  }
}