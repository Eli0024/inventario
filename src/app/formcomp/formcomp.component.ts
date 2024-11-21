import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { ComputersService } from '../services/computers.service';
import { Equipo } from '../models/computer';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-formcomp',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, SidebarComponent], 
  templateUrl: './formcomp.component.html',
  styleUrl: './formcomp.component.css'
})
export class FormcompComponent {

  equipo: Equipo = {
    id_equipo: 0,
    marca: '',
    memoria: '',
    procesador: '',
    office: '',
    serial: '',
    serial_office: '',
    sistema_operativo: '',
    fecha_adquisicion: '',
    estado: '',
    responsable: null,  // O el valor adecuado si tienes un objeto 'Responsable'
    archivo: null
  };
  
  @Input() equipoSeleccionado: any;
 

  constructor(private computersService: ComputersService, private router: Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargar();
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
  