import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployerData } from '../workflow-employe.model';

@Component({
  selector: 'app-employer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employer.component.html',
  styleUrl: './employer.component.css'
})
export class EmployerComponent {
  @Input({ required: true }) data!: EmployerData;
}

