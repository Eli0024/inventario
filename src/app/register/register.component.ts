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
email = '';
password = '';
successMessage = ''; 
errorMessage = ''; 
is_staff: boolean = false;


constructor(private authService: Authservice, private router: Router ) {}

register() {
  const formData = new FormData();
  formData.append('username', this.username);
  formData.append('email', this.email);
  formData.append('password', this.password);
  formData.append('is_staff', String(this.is_staff));

  this.authService.register(formData).subscribe(
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
