import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Authservice } from '../auth.service';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {

  username: string = '';
  password: string = '';
  errorMessage: string = '';


   constructor(private authService: Authservice, private router: Router) {}

   login() {
     const user = { username: this.username, password: this.password};
     this.authService.login(user).subscribe(data => {
       this.authService.setToken(data.token)
     
       this.router.navigate(['/content']);
     },
     error => {
       Swal.fire({
         icon: "error",
         title: "Oops...",
         text: "Usuario o Contraseña Incorrecta!",
       });
     }
   );
   }
   onSubmit() {
     this.login();
   }
 }