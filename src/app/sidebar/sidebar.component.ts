import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { SidebarService } from '../services/sidebar.service';
import { MatIconModule } from '@angular/material/icon';
import { Authservice } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink,],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent  {

  constructor(private authService: Authservice, private router: Router) {}

  logout() {
    this.authService.logout();  // Llama al método logout del servicio
    this.router.navigate(['/login']);
  }
}