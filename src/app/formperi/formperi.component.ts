import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Periferico } from '../models/perife';
import { PerifeService } from '../services/perife.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Colaborador } from '../models/users';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-formperi',
  standalone: true,
  imports: [
    NavbarComponent, 
    CommonModule, 
    FormsModule, 
    SidebarComponent
  ],
  templateUrl: './formperi.component.html',
  styleUrls: ['./formperi.component.css']
})
export class FormperiComponent {
  @Output() perifericoCreado = new EventEmitter<Periferico>();
  @Output() formularioCancelado=new EventEmitter<void>();
  
  periferico: Periferico = {
    id: 0,
    nombre: '',
    modelo: '',
    numero_serie: '',
    fecha_adquisicion: '',
    responsable: { 
      id: 0,
      nombre: '',
      apellido: '' 
    },
    responsable_id:0

  };

  colaboradores: Colaborador[] = [];

  constructor(
    private perifeService: PerifeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.cargarColaboradores();
  }

  cargarColaboradores(): void {
    this.usersService.getAll().subscribe({
      next: (response: Colaborador[]) => {
        this.colaboradores = response;
      },
      error: (error: any) => {
        console.error('Error al obtener los colaboradores', error);
      }
    });
  }

  create(): void {
    console.log('Datos que se envian:',this.periferico);
    if (!this.periferico.responsable_id) {
      Swal.fire('Error', 'Debes seleccionar un responsable', 'error');
      return;
    }

    this.perifeService.create(this.periferico).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Periférico creado correctamente', 'success');
        this.perifericoCreado.emit(response);
        this.resetForm();
        // Cerrar modal manualmente
        document.getElementById('closeModalButton')?.click();
      },
      error: (err) => {
        console.error('Error:', err);
        Swal.fire('Error', err.error?.message || 'Error al crear el periférico', 'error');
      }
    });
  }

  cancelar():void {
    this.formularioCancelado.emit();
  }

  resetForm(): void {
    this.periferico = {
      id: 0,
      nombre: '',
      modelo: '',
      numero_serie: '',
      fecha_adquisicion: '',
      responsable: { 
        id: 0,
        nombre: '',
        apellido: '' 
      },
      responsable_id:0
    };
  }

  getNombreResponsable(id: number): string {
    const colab = this.colaboradores.find(c => c.id === id);
    return colab ? `${colab.nombre} ${colab.apellido}` : 'No encontrado';
  }
}