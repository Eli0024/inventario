import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  isSubmenuOpen: boolean = false; // Inicializa la propiedad como false
  isSidebarVisible: boolean = true; // Por ejemplo, true significa visible
  isSidebarOpen: boolean = true; // Similar a isSidebarVisible, para el estado del sidebar

  // Métodos
  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen; // Cambia el estado del submenu
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Cambia el estado del sidebar
  }
}
