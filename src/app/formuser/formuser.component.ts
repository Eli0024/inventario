import { Component, Input } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { UsersService } from '../services/users.service';
import { Colaborador } from '../models/users';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-formuser',
  standalone: true,
  imports: [NavbarComponent,  FormsModule, CommonModule, SidebarComponent],
  templateUrl: './formuser.component.html',
  styleUrl: './formuser.component.css'
})
export class FormuserComponent {

  colaborador: Colaborador = {
    id_colaborador: 0,
    nombre: '',
    apellido: '',
    empresa: null,
    area: null,
    cargo: '',
    licencia: null,
  };
  
  @Input() colaboradorSeleccionado: any;
 

  constructor(private usersService: UsersService, private router: Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargar();
   }

  cargar():void{

    this.activatedRoute.params.subscribe(
      e=>{
        let id=e['id'];
        if(id){
          this.usersService.get(id).subscribe(
            colaborador => this.colaborador = colaborador
          );
        }
      }
    );
  }

  create(): void {
    this.usersService.create(this.colaborador).subscribe(
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
        this.router.navigate(['/usuarios']);
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
  
  update(): void {
    this.usersService.update(this.colaborador).subscribe(
      () => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registro Actualizado",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/usuarios']);
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

  onEmpresaChange(event: any) {
    console.log("Empresa seleccionada:", event);  // Aquí puedes realizar más acciones si lo deseas.
    this.colaboradorSeleccionado.empresa = event;
  }
  
  onAreaChange(event: any) {
    console.log("Area seleccionada:", event);  // Aquí puedes realizar más acciones si lo deseas.
    this.colaboradorSeleccionado.area = event;
  }
}
