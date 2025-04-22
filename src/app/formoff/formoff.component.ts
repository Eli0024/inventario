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
import { Colaborador } from '../models/users';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-formoff',
  standalone: true,
  imports: [NavbarComponent,  CommonModule, FormsModule, SidebarComponent],
  templateUrl: './formoff.component.html',
  styleUrl: './formoff.component.css'
})

export class FormoffComponent {

  licence: Licence = {
    responsable: { id:0,nombre: '', apellido: '' },
    id: 0,
    correo: '',
    contrasena: '',
    serial_office: '',
  };
  
   colaborador: Colaborador = {
            id: 0,
            nombre: '',
            apellido: '',
            empresa: null,
            area: null,
            cargo: '',
          };
          
  @Input() licenceSeleccionado: any;
  responsables: any[] = [];
  colaboradores: Colaborador[] = [];

  constructor(private licenceService: LicenceService, private router: Router, private activatedRoute:ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.cargar();
    this.loadUsuarios();
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

  loadUsuarios(): void {
    this.usersService.getAll().subscribe(
      (response: Colaborador[]) => {
        this.colaboradores = response;
      },
      (error: any) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }

   create(): void {
      // Validación del responsable
      if (!this.licence.responsable?.id) {
        Swal.fire('Error', 'Debes seleccionar un responsable', 'error');
        return;
      }
  
      // Llamada al servicio
      this.licenceService.create(this.licence).subscribe({
        next: (response) => {
          Swal.fire('Éxito', 'Licencia creada correctamente', 'success');
          this.resetForm();
        },
        error: (err) => {
          console.error('Error:', err);
          const errorMsg = err.message || 'Error al crear el mantenimiento';
          Swal.fire('Error', errorMsg, 'error');
        }
      });
    }
  
    resetForm(): void {
      this.licence = {
        responsable: { id: 0, nombre: '', apellido: '' },
        id: 0,
        correo: '',
        contrasena: '',
        serial_office: '',
      };
    }
    
    // Método reset (correcto)
    getNombreResponsable(id: number): string {
      const colab = this.colaboradores.find(c => c.id === id);
      return colab ? `${colab.nombre} ${colab.apellido}` : 'No encontrado';
    }
  }
  