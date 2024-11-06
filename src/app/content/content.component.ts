import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { InfoComponent } from '../info/info.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [NavbarComponent, RouterLink, InfoComponent, SidebarComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

}
