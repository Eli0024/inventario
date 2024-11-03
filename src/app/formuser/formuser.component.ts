import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { UsersService } from '../services/users.service';
import { Usuario } from '../models/users';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formuser',
  standalone: true,
  imports: [NavbarComponent,  FormsModule, CommonModule],
  templateUrl: './formuser.component.html',
  styleUrl: './formuser.component.css'
})
export class FormuserComponent {

  usuario: Usuario = new Usuario();
 

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
            usuario => this.usuario = usuario
          );
        }
      }
    );
  }

  create(): void {
    this.usersService.create(this.usuario).subscribe(
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
    this.usersService.update(this.usuario).subscribe(
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
}
