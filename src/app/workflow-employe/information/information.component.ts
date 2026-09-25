import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InformationData } from '../workflow-employe.model';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent {
  @Input({ required: true }) data!: InformationData;
}

