import { Component } from '@angular/core';

@Component({
  selector: 'app-formmante',
  standalone: true,
  imports: [],
  templateUrl: './formmante.component.html',
  styleUrl: './formmante.component.css'
})
export class FormmanteComponent {


  usuario: Usuario = {
    id_usuario: 0,
    nombre: '',
    apellido: '',
    empresa: '',
    area: '',
    cargo: '',
    licencia: null,
  };
  
  @Input() usuarioSeleccionado: any;
 

  constructor(private usersService: UsersService, private router: Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargar();
   }

  cargar():void{

    this.activatedRoute.params.subscribe(
      e=>{
        let id=e['id'];
        if(id){
          this.usersService.get(id).subscribe(
            usuario => this.usuario = usuario
          );
        }
      }
    );
  }

  create(): void {
    this.usersService.create(this.usuario).subscribe(
      () => {
        Swal.fire({
          title: "Registro Exitoso",
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        });
        this.router.navigate(['/usuarios']);
      },
      error => {
        Swal.fire({
          title: "Error al registrar",
          text: error.message,
          icon: "error"
        });
      }
    );
  }
  
  update(): void {
    this.usersService.update(this.usuario).subscribe(
      () => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registro Actualizado",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/usuarios']);
      },
      error => {
        Swal.fire({
          title: "Error al actualizar",
          text: error.message,
          icon: "error"
        });
      }
    );
  }
}

