import { Component, OnInit } from '@angular/core';

import { RecursoService } from '../services/recurso.service';



@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent {
  
  // map!: L.Map;

  // constructor(private recursoService: RecursoService) {}

  // ngOnInit() {
  //   this.map = L.map('map').setView([0, 0], 13); // Puedes cambiar la vista inicial

  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; OpenStreetMap contributors'
  //   }).addTo(this.map);

  //   this.recursoService.getRecursos().subscribe(data => {
  //     data.forEach((recurso: any) => {
  //       L.marker([recurso.coordenadas.lat, recurso.coordenadas.lng])
  //         .addTo(this.map)
  //         .bindPopup(`<b>${recurso.tipo}</b><br>${recurso.descripcion}`);
  //     });
  //   });
  // }
}