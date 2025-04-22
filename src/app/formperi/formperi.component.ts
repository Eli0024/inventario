import { Component, Input } from '@angular/core';
import { Periferico } from '../models/perife';
import { PerifeService } from '../services/perife.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Colaborador } from '../models/users';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-formperi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formperi.component.html',
  styleUrl: './formperi.component.css'
})
export class FormperiComponent {

 periferico: Periferico ={
        id: 0,
        nombre: '',
        modelo: '',
        numero_serie: '',
        fecha_adquisicion: '',
        responsable: { // Objeto Responsable por defecto
          id:0,
          nombre: '',
          apellido: ''
        },
      };

 colaborador: Colaborador = {
             id: 0,
             nombre: '',
             apellido: '',
             empresa: null,
             area: null,
             cargo: '',
           };     
    
    @Input() perifericoSeleccionado: any;
    responsables: any[] = [];
    colaboradores: Colaborador[] = [];
  
    constructor(private perifeService: PerifeService, private router: Router, private activatedRoute:ActivatedRoute, private usersService: UsersService) { }
  
    ngOnInit(): void {
      this.cargar();
      this.loadUsuarios();
     }
  
    cargar():void{
  
      this.activatedRoute.params.subscribe(
        e=>{
          let id=e['id'];
          if(id){
            this.perifeService.get(id).subscribe(
              periferico => this.periferico = periferico
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
          if (!this.periferico.responsable?.id) {
            Swal.fire('Error', 'Debes seleccionar un responsable', 'error');
            return;
          }
      
          // Llamada al servicio
          this.perifeService.create(this.periferico).subscribe({
            next: (response) => {
              Swal.fire('Éxito', 'Periferico creado correctamente', 'success');
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
          this.periferico = {
            responsable: { id: 0, nombre: '', apellido: '' },
            id: 0,
            nombre: '',
            modelo: '',
            numero_serie: '',
            fecha_adquisicion: '',
          };
        }
        
        // Método reset (correcto)
        getNombreResponsable(id: number): string {
          const colab = this.colaboradores.find(c => c.id === id);
          return colab ? `${colab.nombre} ${colab.apellido}` : 'No encontrado';
        }
      }
      