import { Component, Input } from '@angular/core';
import { MantenService } from '../services/manten.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Mantenimiento } from '../models/manten';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Colaborador } from '../models/users';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'app-formmante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formmante.component.html',
  styleUrl: './formmante.component.css'
})
export class FormmanteComponent {


  mantenimiento: Mantenimiento = {
    responsable: { id:0, nombre: '', apellido: '' },
    id: 0,
    equipo: '',
    fecha: '',
    tipo: '',
    descripcion: '',
    };
  
    colaborador: Colaborador = {
          id: 0,
          nombre: '',
          apellido: '',
          empresa: null,
          area: null,
          cargo: '',
        };
        
  @Input() mantenimientoSeleccionado: any;
  responsables: any[] = [];
  colaboradores: Colaborador[] = [];
  mantenimientos: Mantenimiento[] = [];

  constructor(private mantenService: MantenService, private router: Router, private activatedRoute:ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.cargar();
    this.loadUsuarios();
   }

  cargar():void{

    this.activatedRoute.params.subscribe(
      e=>{
        let id=e['id'];
        if(id){
          this.mantenService.get(id).subscribe(
            mantenimiento => this.mantenimiento = mantenimiento
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
    if (!this.mantenimiento.responsable?.id) {
      Swal.fire('Error', 'Debes seleccionar un responsable', 'error');
      return;
    }

    // Llamada al servicio
    this.mantenService.create(this.mantenimiento).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Mantenimiento creado correctamente', 'success');
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
    this.mantenimiento = {
      responsable: { id: 0, nombre: '', apellido: '' },
      id: 0,
      equipo: '',
      fecha: '',
      tipo: '',
      descripcion: '',
    };
  }
  
  // Método reset (correcto)
  getNombreResponsable(id: number): string {
    const colab = this.colaboradores.find(c => c.id === id);
    return colab ? `${colab.nombre} ${colab.apellido}` : 'No encontrado';
  }
}

