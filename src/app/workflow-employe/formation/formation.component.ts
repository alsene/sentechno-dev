import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormationData } from '../workflow-employe.model';

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.css'
})
export class FormationComponent {
  @Input({ required: true }) data!: FormationData;
}

