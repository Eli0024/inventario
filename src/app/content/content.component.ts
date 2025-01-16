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


@Component({
  selector: 'app-content',
  standalone: true,
  imports: [NavbarComponent, RouterLink, InfoComponent, SidebarComponent, FormsModule, CommonModule,FormcompComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit{

  totalEquipos: number = 0;
  totalColaboradores: number = 0;
  totalLicencias: number = 0;
 
 
  showSidebar = true; // Controla la visibilidad del sidebar

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
  
  constructor(private usersService: UsersService, private imprerService: ImprerService, private cdr: ChangeDetectorRef, private computersService : ComputersService) {  }

  ngOnInit(): void {
    this.loadColaboradores();
    this.computersService.getTotalEquipos().subscribe((total: number) => {
      this.totalEquipos = total;
    });
    this.usersService.getTotalColaboradores().subscribe((total: number) => {
      this.totalColaboradores = total;
    });
    this.imprerService.getTotalLicencias().subscribe((total: number) => {
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
