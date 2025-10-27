import { ChangeDetectorRef, Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormequipoComponent } from '../../formequipo/formequipo.component';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { ContrasenaEquipo } from '../../models/equipo';
import { EquipoPasswordService } from '../../services/equipo.service';
import { Colaborador } from '../../models/users';

@Component({
  selector: 'app-contra-equipo',
  standalone: true,
  imports: [NavbarComponent,SidebarComponent,FormequipoComponent,CommonModule,FormsModule,RouterLink],
  templateUrl:'./contra-equipo.component.html',
  styleUrls: ['./contra-equipo.component.css']
})
export class ContraEquipoComponent {
  
  contrasenas:ContrasenaEquipo[]=[];
  colaboradores:Colaborador[]=[];
  filter:any={searchTerm:''};
  modalRegistroAbierto: boolean = false;
  modalEdicionAbierto: boolean = false;
  
  equipoSeleccionado: ContrasenaEquipo = {
      id: 0,
      usuario: '',
      correo:'',
      contrasena: '',
      responsable:{
        id:0,
        nombre:'',
        apellido:'',
      },
      archivo: null
  };

  constructor (
    private equipoService:EquipoPasswordService,
    private userService:UsersService,
    private cdr:ChangeDetectorRef
  ){}

  ngOnInit():void{
    this.loadEquipos();
    this.loadColaboradores();
  }

  loadEquipos():void{
    this.equipoService.getAll().subscribe({
      next:(data)=>{
        this.contrasenas=data;
      },
      error:(err)=>{
        console.error('Error al cragar contraseñas de equipos:',err);
      } 
    });
  }
  
  loadColaboradores(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.colaboradores = data;
      },
      error: (err) => {console.error('Error al cargar colaboradores:', err);
      }
    });
  }

  abrirModalRegistro() {
    this.modalRegistroAbierto = true;
  }

  cerrarModalRegistro() {
    this.modalRegistroAbierto = false;
  }

  abrirModalEdicion(equipo: ContrasenaEquipo) {
    this.equipoSeleccionado = { ...equipo };
    this.modalEdicionAbierto = true;
  }

  cerrarModalEdicion() {
    this.modalEdicionAbierto = false;
  }

  handleRegistroExitoso(): void {
    this.modalRegistroAbierto = false;
    this.loadEquipos();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.equipoSeleccionado.archivo = file;
    }
  }
  
  getArchivoUrl(): string {
    if (typeof this.equipoSeleccionado.archivo === 'string') {
      return this.equipoSeleccionado.archivo;
    }
    return ''
  }

  getNombreArchivo(equipo: ContrasenaEquipo): string {
     if (equipo.archivo instanceof File) {
        return equipo.archivo.name;
      }
      return  'Archivo Cargado';
  }
  getNombreResponsable(id: number): string {
    const res = this.colaboradores.find(c => c.id === id);
    return res ? `${res.nombre} ${res.apellido}` : 'No encontrado';
  }

  onResponsableChange(event: any): void {
  const selectedId = Number(event.target.value);
  const colaborador = this.colaboradores.find(c => c.id === selectedId);
  if (colaborador) {
    this.equipoSeleccionado.responsable = {
      id:colaborador.id,
      nombre:colaborador.nombre,
      apellido:colaborador.apellido,
    };
  }
 }

  
  update(): void {
  if (!this.equipoSeleccionado.id) return;

  const formData: FormData = new FormData();
  formData.append('usuario', this.equipoSeleccionado.usuario);
  formData.append('contrasena', this.equipoSeleccionado.contrasena);
  formData.append('responsable', String(this.equipoSeleccionado.responsable.id));

  if (this.equipoSeleccionado.archivo instanceof File) {
    formData.append('archivo', this.equipoSeleccionado.archivo);
  }

  this.equipoService.update(this.equipoSeleccionado.id, formData).subscribe({
    next: () => {
      Swal.fire('Actualizado', 'La contraseña se actualizó correctamente.', 'success');
      this.modalEdicionAbierto = false;
      this.loadEquipos();
    },
    error: (error) => {
      Swal.fire('Error', 'No se pudo actualizar la contraseña.', 'error');
      console.error('Error en actualización:', error);
    }
  });
}



  delete(id: number): void {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.equipoService.delete(id).subscribe(
            () => {
              Swal.fire(
                '¡Eliminado!',
                'El equipo ha sido eliminado correctamente.',
                'success'
              );
    
              this.contrasenas = this.contrasenas.filter(c => c.id !== id);
            },
            (error) => {
              if (error.status === 403) {
                Swal.fire(
                  'Error',
                  'No tienes permisos para eliminar contraseñas.',
                  'error'
                  );
                } else {
                  Swal.fire(
                    'Error',
                    'Ocurrió un error al eliminar la contraseña.',
                    'error'
                  );
                }
                console.error(error);
              }
            );
          }
        });
  }

  get contrasenasFiltradas(): ContrasenaEquipo[] {
  if (!this.contrasenas || !this.contrasenas.length) return [];

  const term = this.filter.searchTerm.toLowerCase().trim();
  if (!term) return this.contrasenas;

  return this.contrasenas.filter(c =>
    c.usuario?.toLowerCase().includes(term) ||
    c.correo?.toLowerCase().includes(term) ||
    c.contrasena?.toLowerCase().includes(term) ||
    (c.responsable &&
      (c.responsable.nombre + ' ' + c.responsable.apellido)
        .toLowerCase()
        .includes(term))
   );
 }


}  
