import { Component } from '@angular/core';
import { Router ,RouterLink} from '@angular/router';
import { Authservice } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../services/empresa.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  empresaSeleccionada: number | null=null;
  empresas: any[] = [];
  errorMessage: string = '';
  isPasswordVisible: boolean = false;
  isLoading: boolean = false;
  pasoLogin:boolean=false;

  constructor(
    private authService: Authservice, 
    private empresaService: EmpresaService,
    private router: Router
  ) {}


  login(event: Event) {
    event.preventDefault();
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Usuario y contraseña son obligatorios';
      return;
    }
  
    this.isLoading = true;  
    
    const data = {
        username: this.username,
        password: this.password,
      };
    
     this.authService.login(data).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.pasoLogin=true;
        this.cargarEmpresas();
        this.isLoading=false;
      },
      error:()=>{
        this.errorMessage='Usuario o contraseña son incorrectos';
        this.isLoading=false;
      }
    });
  }


  cargarEmpresas(){
    this.empresaService.getEmpresas().subscribe({
      next:(res)=>{
        this.empresas=res;
      },
      error:()=>{
        this.errorMessage='No  se pudieron cargar las empresas'
      }
    });
  }

  seleccionarEmpresa() {
  if (!this.empresaSeleccionada) {
    this.errorMessage = 'Debes seleccionar una empresa';
    return;
  }

  // Guardar empresa en el AuthService/localStorage
  this.authService.setEmpresaId(this.empresaSeleccionada);

  // Ya puedes navegar, no necesitas llamar al backend
  this.router.navigate(['/content']);
}

  
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

 
  clearError() {
    this.errorMessage = '';
  }
}