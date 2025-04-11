import { Component } from '@angular/core';
import { Mantenimpre } from '../models/mantenim';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MantenimpreService } from '../services/mantenimpre.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterLink ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {

   mantenimpre : Mantenimpre = {
      impresora: { // Objeto Responsable por defecto
        nombre: ''
      },
      id: 0,
      fecha: '',
      descripcion: '',
      realizado_por: '',
    }

    isLoading = true;
    error: string | null = null;
  
    constructor(
      private route: ActivatedRoute,
      private mantenimpreService: MantenimpreService
    ) {}
  
    ngOnInit(): void {
      const idParam = this.route.snapshot.paramMap.get('id');
      
      if (!idParam) {
        this.error = 'ID no proporcionado';
        this.isLoading = false;
        return;
      }
  
      const id = +idParam;
      this.loadMantenimiento(id);
    }
  
    loadMantenimiento(id: number): void {
      this.isLoading = true;
      this.error = null;
  
      this.mantenimpreService.getById(id).subscribe({
        next: (data) => {
          this.mantenimpre = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message || 'Error al cargar los datos del mantenimiento';
          this.isLoading = false;
          console.error('Error al cargar mantenimiento:', err);
        }
      });
    }
  }
