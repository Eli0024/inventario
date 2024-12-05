import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { SidebarService } from '../sidebar.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink,],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent  {

}