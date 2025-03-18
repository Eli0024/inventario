import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { InfoComponent } from '../info/info.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormcompComponent } from '../formcomp/formcomp.component';
import { Colaborador } from '../models/users';
import { UsersService } from '../services/users.service';
import { ComputersService } from '../services/computers.service';
import { ImprerService } from '../services/imprer.service';
import { VermasComponent } from '../vermas/vermas.component';
import { MantenService } from '../services/manten.service';
import { LicenceService } from '../services/licence.service';
import { PerifeService } from '../services/perife.service';


@Component({
  selector: 'app-content',
  standalone: true,
  imports: [NavbarComponent, RouterLink, InfoComponent, SidebarComponent, FormsModule, CommonModule,FormcompComponent,
    VermasComponent
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit{

  totalEquipos: number = 0;
  totalColaboradores: number = 0;
  totalLicencias: number = 0;
  totalMantenimientos: number = 0;
  totalImpresoras: number = 0;
  totalPerifericos: number = 0;
  area: string = ''; 
 
 
  showSidebar = true; // Controla la visibilidad del sidebar

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
  
  constructor(private usersService: UsersService, private imprerService: ImprerService, private cdr: ChangeDetectorRef, private computersService : ComputersService,
    private licenceService: LicenceService, private mantenService: MantenService, private perifeService: PerifeService
  ) {  }

  ngOnInit(): void {
    this.loadColaboradores();
    this.computersService.getTotalEquipos().subscribe((total: number) => {
      this.totalEquipos = total;
    });
    this.usersService.getTotalColaboradores().subscribe((total: number) => {
      this.totalColaboradores = total;
    });
    this.licenceService.getTotalLicencias().subscribe((total: number) => {
      this.totalLicencias = total;
    });
    this.mantenService.getTotalMantenimientos().subscribe((total: number) => {
      this.totalMantenimientos = total;
    });
    this.imprerService.getTotalImpresoras().subscribe((total: number) => {
      this.totalImpresoras = total;
    });
    this.perifeService.getTotalPerifericos().subscribe((total: number) => {
      this.totalLicencias = total;
    });
    }

    loadColaboradores(): void {
      this.usersService.getAll().subscribe(
        (response: Colaborador[]) => {
          this.colaboradores = response;
        },
        (error: any) => {
          console.error('Error al obtener los usuarios', error);
        }
      );
    }

    colaboradores : Colaborador[] = [];

    colaborador: Colaborador= {
    id_colaborador: 0,
    nombre: '',
    apellido: '',
    empresa: null,
    area: null,
    cargo: '',
    licencia: null,
  };

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
        a.download = `usuarios_y_equipos_${this.area}.xlsx`; // Nombre del archivo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al descargar el reporte:', error);
        if (error.status === 404) {
          alert('No se encontró ningún usuario para el área especificada.');
        } else {
          alert('Ocurrió un error al descargar el reporte.');
        }
      }
    );
  }

  filter: any = { searchTerm: '' };
  
  filterColaboradores(): Colaborador[] {
    if (this.colaboradores && this.colaboradores.length) {
      return this.colaboradores.filter(Colaborador =>
        Colaborador.nombre.toLowerCase().includes(this.filter.searchTerm.toLowerCase()) ||
        Colaborador.apellido.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
      );
    }
    return [];
  }
}
