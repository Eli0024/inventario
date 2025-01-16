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
    const user = { username: this.username, password: this.password, is_staff: this.is_staff};
    this.authService.register(user).subscribe( data => {
      this.authService.setToken(data.token);
      this.router.navigateByUrl("login")
    });
  }
}