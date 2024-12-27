import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { ComputersService } from '../services/computers.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Usuario } from '../models/users';
import { UsersService } from '../services/users.service';
import { Equipo } from '../models/computer';

@Component({
  selector: 'app-formcomp',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, SidebarComponent, ReactiveFormsModule], 
  templateUrl: './formcomp.component.html',
  styleUrl: './formcomp.component.css'
})
export class FormcompComponent {

 
  equipo: Equipo = {
    responsable: { nombre: '', apellido: '' },
    id_equipo: 0,
    marca: '',
    modelo: '',
    memoria: '',
    procesador: '',
    office: '',
    serial: '',
    windows: '',
    sistema_operativo: '',
    fecha_adquisicion: '',
    estado: '',
    archivo: null
  };

  

   usuario: Usuario = {
      id_usuario: 0,
      nombre: '',
      apellido: '',
      empresa: null,
      area: null,
      cargo: '',
      licencia: null,
    };
    

  responsables: any[] = [];
  usuarios: Usuario[] = [];
  
  @Input() equipoSeleccionado: any;
 

  constructor(private computersService: ComputersService, private usersService: UsersService, private router: Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargar();
    this.loadUsuarios();
   }

   loadUsuarios(): void {
    this.usersService.getAll().subscribe(
      (response: Usuario[]) => {
        this.usuarios = response;
      },
      (error: any) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }

  cargar():void{

    this.activatedRoute.params.subscribe(
      e=>{
        let id=e['id'];
        if(id){
          this.computersService.get(id).subscribe(
            equipo => this.equipo = equipo
          );
        }
      }
    );
  }

  create(): void {
    this.computersService.create(this.equipo).subscribe(
      () => {
        Swal.fire({
          title: "Registro Exitoso",
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        });
        this.router.navigate(['/info']);
      },
      error => {
        Swal.fire({
          title: "Error al registrar",
          text: error.message,
          icon: "error"
        });
      }
    );
  }
  
  
  guardarEquipo() {
    // Aquí puedes implementar la lógica para guardar los cambios.
    // Puedes emitir un evento hacia el componente padre o llamar a un servicio para actualizar el equipo en la base de datos.
    console.log("Datos guardados:", this.equipoSeleccionado);
  } 
  
  update(): void {
    this.computersService.update(this.equipo).subscribe(
      () => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registro Actualizado",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/info']);
      },
      error => {
        Swal.fire({
          title: "Error al actualizar",
          text: error.message,
          icon: "error"
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
}
  