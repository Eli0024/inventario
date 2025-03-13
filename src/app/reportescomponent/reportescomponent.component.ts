import { Component, NgModule } from '@angular/core';
import { UsersService } from '../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportescomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportescomponent.component.html',
  styleUrl: './reportescomponent.component.css'
})
export class ReportescomponentComponent {

  area: string = ''; // Variable para almacenar el área seleccionada

  constructor(private usersService: UsersService) {}

  descargarReporte() {
    if (!this.area) {
      alert('Por favor, selecciona un área.');
      return;
    }

    this.usersService.generarReporteUsuariosPorArea(this.area).subscribe(
      (data: Blob) => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `usuarios_${this.area}.xlsx`; // Nombre del archivo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al descargar el reporte:', error);
        alert('Ocurrió un error al descargar el reporte.');
      }
    );
  }
}
