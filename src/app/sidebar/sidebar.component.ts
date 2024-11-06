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

  sidebarVisible: boolean = false;
  // Método que se llama al hacer clic en el botón
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
