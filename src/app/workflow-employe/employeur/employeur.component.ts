import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeurData } from '../workflow-employe.model';

@Component({
  selector: 'app-employeur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employeur.component.html',
  styleUrl: './employeur.component.css'
})
export class EmployeurComponent {
  @Input({ required: true }) data!: EmployeurData;
}

