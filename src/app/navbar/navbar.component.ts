import { Component } from '@angular/core';
import { ContentComponent } from '../content/content.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ContentComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
