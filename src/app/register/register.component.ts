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
  errorMessage = ''; 
  is_staff: boolean = false;


   constructor(private authService: Authservice, private router: Router ) {}

   register() {
     const user = { username: this.username, password: this.password, is_staff: this.is_staff};
     this.authService.register(user).subscribe( data => {
     this.authService.setToken(data.token);
     this.router.navigateByUrl("login")
     });
   }
}