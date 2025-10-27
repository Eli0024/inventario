import { Component } from '@angular/core';
import { Mantenimpre } from '../models/mantenim';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MantenimpreService } from '../services/mantenimpre.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterLink, CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  impresora:any = { nombre: '',direccion_ip:'' };
  mantenimientos:any[] = [];

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
      this.loadMantenimientos(id);
    }
  
    loadMantenimientos(id_impresora: number): void {
      this.isLoading = true;
      this.error = null;
  
      this.mantenimpreService.getByImpresora(id_impresora).subscribe({
        next: (data) => {
          this.impresora=data.impresora
          this.mantenimientos = data.mantenimientos;
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
