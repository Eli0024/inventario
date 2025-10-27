import { Component, OnInit } from '@angular/core';
import { Authservice } from '../auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  username = '';
  password = '';
  successMessage = ''; 
  confirmPassword='';
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  errorMessage = ''; 
  is_staff: boolean = false;
  isSubmitting=false;


   constructor(private authService: Authservice, private router: Router ) {}


  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

   toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  } 
  
   register() {
    if (!this.username || !this.password || !this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos antes de continuar.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    // Validación de contraseñas 
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Las contraseñas no coinciden',
        text: 'Asegúrate de que ambas contraseñas sean iguales.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }
    this.isSubmitting = true;

    const user = {
      username: this.username,
      password: this.password,
      is_staff: this.is_staff
    };

    this.authService.register(user).subscribe({
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Tu cuenta ha sido creada correctamente.',
          confirmButtonColor: '#2563eb'
        });
        this.authService.setToken(data.token);
        this.router.navigateByUrl('login');
      },
      error: (err: any) => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al registrarse',
          text: 'No se pudo crear la cuenta. Inténtalo nuevamente.',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }
}