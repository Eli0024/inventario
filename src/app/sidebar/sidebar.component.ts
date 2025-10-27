import { CommonModule } from '@angular/common';
import { Component,ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  showPasswords = false; 

  constructor(
    private authService: Authservice,
    private router: Router,
    private eRef:ElementRef
  ) {}

  

 togglePasswords() {
    this.showPasswords = !this.showPasswords; 
  }

  logout() {
    console.log('Cerrando sesión... ')
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }

}