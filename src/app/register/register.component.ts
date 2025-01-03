import { Component } from '@angular/core';
import { Authservice } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username = '';
  password = '';
  successMessage = ''; 
  errorMessage = ''; 
  is_staff: boolean = false;


  constructor(private authService: Authservice, private router: Router ) {}

  register() {
    const body = {
      username: this.username,
      password: this.password,
      is_staff: String(this.is_staff)
    };
  
    // Llamar al servicio de autenticación y enviar los datos en formato JSON
    this.authService.register(body).subscribe(
      (data: any) => {
        this.authService.setToken(data.token);
        this.router.navigate(['/']);
        Swal.fire("Registro Exitoso!");
      },
      (error: any) => {
        console.error('Error al registrar', error);
      }
    );
  }
  
}