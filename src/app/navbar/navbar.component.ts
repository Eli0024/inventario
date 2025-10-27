import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../services/sidebar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../services/empresa.service';

interface Empresa {
  id: number;
  nombre: string;
  logo: string;
  color_gradient: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatToolbarModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  empresa: Empresa | null = null;

  constructor(private sidebarService: SidebarService,private empresaService:EmpresaService) {}

  ngOnInit(): void {
    this.empresaService.getEmpresaActual().subscribe({
      next: (res) => {
        this.empresa = res;

        localStorage.setItem('empresa_actual', JSON.stringify(res));
  },
      error: (err) => {
        console.error('Error al obtener datos de la empresa:', err);
      }
    });
  
 }

  cargarEmpresa() {
    const empresaJson = localStorage.getItem('empresa_actual');
    if (empresaJson) {
      this.empresa = JSON.parse(empresaJson);
    }
  }

  // Modifica la función normalizar para manejar ambos formatos
normalizar(texto: string): string {
  if (!texto) return '';
  
  // Convertir a minúsculas y quitar acentos
  let normalizado = texto.toLowerCase()
                       .normalize("NFD")
                       .replace(/[\u0300-\u036f]/g, "")
                       .trim();

  // Manejar ambos formatos (con y sin "de")
  if (normalizado.includes('industrias basicas caldas')) {
    return 'industrias basicas caldas'; // Mantén la clave sin "de"
  }
  
  return normalizado;
}

// Asegúrate que getLogoPath() use la clave correcta
getLogoPath(): string {
  if (!this.empresa) return '';
  
  const logos: { [key: string]: string } = {
    'ecovita': '/assets/ecovitta.png',
    'quimicos del cauca': '/assets/quimicos_cauca.png',
    'quimica basica colombiana': '/assets/quimica_basica.png',
    'industrias basicas caldas': '/assets/caldas.png', 
    'quimicos del cauca mexico': '/assets/mexico.png'
  };
  
  const key = this.normalizar(this.empresa.nombre);
  return logos[key] || '';
}

// Modifica getNavarGradient() para manejar el nombre complet
getNavarGradient(): string {
  if (!this.empresa) return 'from-gray-200 to-gray-300';

  const estilos: { [key: string]: string } = {
    'ecovita': 'bg-gradient-to-r to-teal-400 from-blue-600',
    'quimicos del cauca': 'bg-gradient-to-r from-blue-800 to-sky-600',
    'quimica basica colombiana': 'bg-gradient-to-l from-sky-600 to-blue-700',
    'industrias basicas caldas': 'bg-gradient-to-r from-blue-800 to-sky-600',
    'quimicos del cauca mexico': 'bg-gradient-to-r from-blue-800 to-sky-600'
  };

  const key = this.normalizar(this.empresa.nombre);
  return estilos[key] || 'from-blue-700 to-gray-300';
}


  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

}
