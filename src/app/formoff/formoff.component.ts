import { Component, Input, NgModule } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Licence } from '../models/licence';
import { LicenceService } from '../services/licence.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-formoff',
  standalone: true,
  imports: [NavbarComponent,  CommonModule, FormsModule, SidebarComponent],
  templateUrl: './formoff.component.html',
  styleUrl: './formoff.component.css'
})

export class FormoffComponent {

  licence: Licence = {
    id_licencia: 0,
    nombre: '',
    contrasena: '',
  };
  
  @Input() licenceSeleccionado: any;
 

  constructor(private licenceService: LicenceService, private router: Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargar();
   }

  cargar():void{

    this.activatedRoute.params.subscribe(
      e=>{
        let id=e['id'];
        if(id){
          this.licenceService.get(id).subscribe(
            licence => this.licence = licence
          );
        }
      }
    );
  }

  create(): void {
    this.licenceService.create(this.licence).subscribe(
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
        this.router.navigate(['/licencias']);
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
    this.licenceService.update(this.licence).subscribe(
      () => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registro Actualizado",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/licencias']);
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
  