import { CommonModule } from '@angular/common';
import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LicenceService } from '../services/licence.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormoffComponent } from '../formoff/formoff.component';
import { Licence } from '../models/licence';



@Component({
  selector: 'app-licencias',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent, SidebarComponent, FormoffComponent, RouterLink],
  templateUrl: './licencias.component.html',
  styleUrl: './licencias.component.css'
})
export class LicenciasComponent implements OnInit {

  licencias: Licence[] = [];
  licenceSeleccionado: Licence = {
    responsable: { id:0, nombre: '', apellido: '' },
    id: 0,
    correo: '',
    contrasena: '',
    serial_office: ''
  };
  modalAbierto = false;
  filter = {
    searchTerm: ''
  };

  constructor(private licenceService: LicenceService) {}

  ngOnInit(): void {
    this.cargarLicencias();
  }

  cargarLicencias(): void {
    this.licenceService.getAll().subscribe({
      next: (data) => this.licencias = data,
      error: (err) => console.error('Error al cargar licencias:', err)
    });
  }

  filterLicences(): Licence[] {
    if (!this.filter.searchTerm) return this.licencias;
    
    return this.licencias.filter(licence => 
      licence.correo.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
      licence.contrasena.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
      licence.serial_office.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
    );
  }

  openModalAndEdit(licence: Licence): void {
    this.licenceSeleccionado = {...licence};
    this.modalAbierto = true;
  }

  closeModal(): void {
    this.modalAbierto = false;
    this.licenceSeleccionado = {
      responsable: { id:0, nombre: '', apellido: '' },
      id: 0,
      correo: '',
      contrasena: '',
      serial_office: ''
    };
  }

  update(): void {
    this.licenceService.update(this.licenceSeleccionado)
      .subscribe({
        next: () => {
          this.closeModal();
          this.cargarLicencias(); // Actualiza la tabla
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
  }

  delete(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta licencia?')) {
      this.licenceService.delete(id).subscribe({
        next: () => this.cargarLicencias(), // Actualiza la tabla
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }
}