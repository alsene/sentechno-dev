import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdresseData } from '../workflow-employe.model';

@Component({
  selector: 'app-adresse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adresse.component.html',
  styleUrl: './adresse.component.css'
})
export class AdresseComponent {
  @Input({ required: true }) data!: AdresseData;
}

