import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SuiviProduitComponent } from '../suivi-produit/suivi-produit.component';
import { ProduitFulmineComponent } from "../produit-fulmine/produit-fulmine.component";
import { ProduitTableauBordComponent } from '../produit-tableau-bord/produit-tableau-bord.component';
import { ProduitService } from '../services/produit/produit.service';

@Component({
  selector: 'app-qualite-produit',
  standalone: true,
  imports: [CommonModule, SuiviProduitComponent, ProduitFulmineComponent, ProduitTableauBordComponent],
  templateUrl: './qualite-produit.component.html',
  styleUrl: './qualite-produit.component.css'
})
export class QualiteProduitComponent {
  activeSection = 'home';
  auth = inject(AuthService);
  router = inject<any>(Router);
  showSection(section: string): void {
    this.activeSection = section;
  }
  constructor( private produitService: ProduitService) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }
}
