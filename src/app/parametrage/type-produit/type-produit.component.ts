import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TypeProduit } from '../../model/TypeProduit';
import { TypeProduitService } from '../../services/parametrage/type-produit.service';

@Component({
  selector: 'app-type-produit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './type-produit.component.html',
  styleUrl: './type-produit.component.css'
})
export class TypeProduitComponent implements OnInit {
  auth = inject(AuthService);
  router = inject<any>(Router);

  typeProduit: TypeProduit = new TypeProduit();
  typesProduit: TypeProduit[] = [];
  newTypeProduit = false;
  isEditing = false;
  editingIndex: number | null = null;
  pageSize = 10;
  currentPage = 1;

  constructor(private typeProduitService: TypeProduitService) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.chargerTypeProduits();
  }

  chargerTypeProduits(): void {
    this.typeProduitService.getTypeProduits().subscribe({
      next: (data) => {
        this.typesProduit = data || [];
        this.currentPage = 1;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des types de produit :', erreur);
      }
    });
  }

  ajouterTypeProduit(): void {
    if (!this.typeProduit.libelle || !this.typeProduit.description) {
      return;
    }

    const payload = this.toApiPayload(this.typeProduit);
    if (this.isEditing && this.editingIndex !== null) {
      this.typeProduitService.updateTypeProduit(payload).subscribe({
        next: (reponse) => {
          this.typesProduit[this.editingIndex!] = this.normalizeFromApi(reponse);
          this.cancelEdit();
        },
        error: (erreur) => {
          console.error('Erreur lors de la modification du type produit :', erreur);
        }
      });
      return;
    }

    this.typeProduitService.addTypeProduit(payload).subscribe({
      next: (reponse) => {
        this.typesProduit.push(this.normalizeFromApi(reponse));
        this.currentPage = this.totalPages;
        this.resetForm();
      },
      error: (erreur) => {
        console.error('Erreur lors de l\'ajout du type produit :', erreur);
      }
    });
  }

  editTypeProduit(typeProduit: TypeProduit): void {
    this.typeProduit = this.normalizeFromApi({ ...typeProduit });
    this.isEditing = true;
    this.editingIndex = this.typesProduit.findIndex((item) => item.id === typeProduit.id);
    this.newTypeProduit = true;
  }

  supprimerTypeProduit(id: number): void {
    const typeProduitASupprimer = this.typesProduit.find((item) => item.id === id);
    if (!typeProduitASupprimer) {
      return;
    }

    this.typeProduitService.removeTypeProduit(typeProduitASupprimer).subscribe({
      next: () => {
        this.typesProduit = this.typesProduit.filter((item) => item.id !== id);
        if (this.isEditing && this.typeProduit.id === id) {
          this.cancelEdit();
        }
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      },
      error: (erreur) => {
        console.error('Erreur lors de la suppression du type produit :', erreur);
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingIndex = null;
    const resetTypeProduit = this.typeProduitService.cancelEditer();
    this.typeProduit = this.normalizeFromApi({
      ...resetTypeProduit,
      id: 0,
      libelle: '',
      description: ''
    });
    this.newTypeProduit = false;
  }

  private resetForm(): void {
    this.typeProduit = new TypeProduit();
    this.newTypeProduit = false;
  }

  private normalizeFromApi(item: any): TypeProduit {
    return {
      ...item
    };
  }

  private toApiPayload(item: any): TypeProduit {
    return {
      ...item
    };
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.typesProduit.length / this.pageSize));
  }

  get paginatedTypeProduits(): TypeProduit[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.typesProduit.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1) {
      this.currentPage = 1;
      return;
    }

    if (page > this.totalPages) {
      this.currentPage = this.totalPages;
      return;
    }

    this.currentPage = page;
  }

  trackById(_index: number, item: TypeProduit): number | string {
    return item?.id ?? _index;
  }

  trackByPage(_index: number, page: number): number {
    return page;
  }

}
