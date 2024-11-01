import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-formcomp',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './formcomp.component.html',
  styleUrl: './formcomp.component.css'
})
export class FormcompComponent {

  parametro: Parametro = new Parametro();
 

  constructor(private parametrosService: ParametrosService, private router: Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargar();
   }

  cargar():void{

    this.activatedRoute.params.subscribe(
      e=>{
        let id=e['id_config'];
        if(id){
          this.parametrosService.get(id).subscribe(
            parametro => this.parametro = parametro
          );
        }
      }
    );
  }

  create(): void {
    this.parametrosService.create(this.parametro).subscribe(
      () => this.router.navigate(['/establecer']),
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
      })
    );
  }

  update(): void {
    this.parametrosService.update(this.parametro).subscribe(
      () => this.router.navigate(['/establecer']),
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Registro Actualizado",
        showConfirmButton: false,
        timer: 1500
      })  
    );
  }
}
