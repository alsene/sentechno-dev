import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../services/produit/produit.service';

@Component({
  selector: 'app-produit-tableau-bord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produit-tableau-bord.component.html',
  styleUrl: './produit-tableau-bord.component.css'
})
export class ProduitTableauBordComponent implements OnInit {
  produits: any[] = [];

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.produits = this.produitService.getAllProduits();
  }

  traiterProduit(produit: any): void {
    // Logique pour traiter le produit
    console.log('Traiter le produit:', produit);
  }
}
