import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiviProduitComponent } from '../suivi-produit/suivi-produit.component';
import { ProduitFulmineComponent } from "../produit-fulmine/produit-fulmine.component";
import { ProduitTableauBordComponent } from '../produit-tableau-bord/produit-tableau-bord.component';

@Component({
  selector: 'app-qualite-produit',
  standalone: true,
  imports: [CommonModule, SuiviProduitComponent, ProduitFulmineComponent, ProduitTableauBordComponent],
  templateUrl: './qualite-produit.component.html',
  styleUrl: './qualite-produit.component.css'
})
export class QualiteProduitComponent {
  activeSection = 'home';

  showSection(section: string): void {
    this.activeSection = section;
  }
}
