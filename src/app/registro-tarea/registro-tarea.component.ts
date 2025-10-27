import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistroTareaService } from '../services/registro-tarea.service';
import { RegistroTarea } from '../models/registro-tarea';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-registro-tarea',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './registro-tarea.component.html',
})
export class RegistroTareaComponent implements OnInit {
  registros: RegistroTarea[] = [];
  nuevaDescripcion: string = '';
  cargando = false;

  constructor(private registroTareaService: RegistroTareaService) {}

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros(): void {
    this.cargando = true;
    this.registroTareaService.getAll().subscribe({
      next: (data) => {
        this.registros = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando registros', err);
        this.cargando = false;
      },
    });
  }

  crearRegistro(): void {
    if (!this.nuevaDescripcion.trim()) return;

    const nuevo: Partial<RegistroTarea> = { descripcion: this.nuevaDescripcion };

    this.registroTareaService.create(this.nuevaDescripcion).subscribe({
      next: (registroCreado) => {
        this.registros.unshift(registroCreado);
        this.nuevaDescripcion = '';
      },
      error: (err) => console.error('Error creando registro', err),
    });
  }

  

  eliminarRegistro(id: number): void {
    this.registroTareaService.delete(id).subscribe({
      next: () => {
        this.registros = this.registros.filter((r) => r.id !== id);
      },
      error: (err) => console.error('Error eliminando registro', err),
    });
  }
}
