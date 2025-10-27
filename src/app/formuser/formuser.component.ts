import { Component, Input,Output,EventEmitter, ViewChild,OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { UsersService } from '../services/users.service';
import { Colaborador } from '../models/users';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-formuser',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule, SidebarComponent],
  templateUrl: './formuser.component.html',
  styleUrls: ['./formuser.component.css']
})
export class FormuserComponent implements OnInit {
  
  @Input() empresas: any[] = [];
  @Output() usuarioCreado=new EventEmitter<Colaborador>();
  @Output() formularioCancelado=new EventEmitter<void>();

  userForm!: FormGroup;
  isSubmitting: boolean = false;

  colaborador: Colaborador = {
    id: 0,
    nombre: '',
    apellido: '',
    empresa: {id:0,nombre:''},
    empresa_id: 0,
    area: null,
    cargo: '',
  };
  

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/)
      ]],
      apellido: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/)
      ]],
      empresa_id: [0, [Validators.required, Validators.min(1)]],
      area: ['', Validators.required],
      cargo: ['', Validators.required],
    });

    this.cargar();
  }

  cargar(): void {
    this.activatedRoute.params.subscribe(e => {
      let id = e['id'];
      if (id) {
        this.usersService.get(id).subscribe(
          colaborador => this.colaborador = colaborador
        );
      }
    });
  }

  create(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      Swal.fire({
        title: "Formulario incompleto",
        text: "Por favor complete todos los campos requeridos correctamente",
        icon: "warning"
      });
      return;
    }
    this.isSubmitting = true;

    const nuevoColaborador: Colaborador = this.userForm.value;
    

    this.usersService.create(nuevoColaborador).subscribe({
      next: () => {
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "El usuario ha sido registrado correctamente",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
        this.userForm.reset({
          nombre: '',
          apellido: '',
          empresa_id: 0,
          area: '',
          cargo: ''
        });
        this.isSubmitting = false;
        this.usuarioCreado.emit(nuevoColaborador);
      },
      error: (error) => {
        Swal.fire({
          title: "Error al registrar",
          text: error.message || "Ocurrió un error al registrar el usuario",
          icon: "error"
        });
        this.isSubmitting = false;
      }
    });
  }

  cancelar(): void {
    this.userForm.reset();
    this.formularioCancelado.emit();
  }

  update(): void {
    if (this.userForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.usersService.update(this.colaborador).subscribe({
      next: () => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registro Actualizado",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        Swal.fire({
          title: "Error al actualizar",
          text: error.message,
          icon: "error"
        });
      }
    });
  }


  private marcarCamposComoTocados(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.controls[key].markAsTouched();
    });
  }

}