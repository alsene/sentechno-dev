import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PoidsProduit } from '../../model/PoidsProduit';
import { PoidsProduitService } from '../../services/parametrage/poids-produit.service';

@Component({
  selector: 'app-poids-produit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poids-produit.component.html',
  styleUrl: './poids-produit.component.css'
})
export class PoidsProduitComponent implements OnInit {
  auth = inject(AuthService);
  router = inject<any>(Router);

  poidsProduit: PoidsProduit = new PoidsProduit();
  poidsProduits: PoidsProduit[] = [];
  newPoidsProduit = false;
  isEditing = false;
  editingIndex: number | null = null;
  pageSize = 10;
  currentPage = 1;

  constructor(private poidsProduitService: PoidsProduitService) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.chargerPoidsProduits();
  }

  chargerPoidsProduits(): void {
    this.poidsProduitService.getPoidsProduits().subscribe({
      next: (data) => {
        this.poidsProduits = data || [];
        this.currentPage = 1;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des poids produit :', erreur);
      }
    });
  }

  ajouterPoidsProduit(): void {
    if (!this.poidsProduit.codePoids || this.poidsProduit.poids == null || this.poidsProduit.poids === '') {
      return;
    }

    const payload = this.toApiPayload(this.poidsProduit);
    if (this.isEditing && this.editingIndex !== null) {
      this.poidsProduitService.updatePoidsProduit(payload).subscribe({
        next: (reponse) => {
          this.poidsProduits[this.editingIndex!] = this.normalizeFromApi(reponse);
          this.cancelEdit();
        },
        error: (erreur) => {
          console.error('Erreur lors de la modification du poids produit :', erreur);
        }
      });
      return;
    }

    this.poidsProduitService.addPoidsProduit(payload).subscribe({
      next: (reponse) => {
        this.poidsProduits.push(this.normalizeFromApi(reponse));
        this.currentPage = this.totalPages;
        this.resetForm();
      },
      error: (erreur) => {
        console.error('Erreur lors de l\'ajout du poids produit :', erreur);
      }
    });
  }

  editPoidsProduit(poidsProduit: PoidsProduit): void {
    this.poidsProduit = this.normalizeFromApi({ ...poidsProduit });
    this.isEditing = true;
    this.editingIndex = this.poidsProduits.findIndex((item) => item.id === poidsProduit.id);
    this.newPoidsProduit = true;
  }

  supprimerPoidsProduit(id: number): void {
    const poidsProduitASupprimer = this.poidsProduits.find((item) => item.id === id);
    if (!poidsProduitASupprimer) {
      return;
    }

    this.poidsProduitService.removePoidsProduit(poidsProduitASupprimer).subscribe({
      next: () => {
        this.poidsProduits = this.poidsProduits.filter((item) => item.id !== id);
        if (this.isEditing && this.poidsProduit.id === id) {
          this.cancelEdit();
        }
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      },
      error: (erreur) => {
        console.error('Erreur lors de la suppression du poids produit :', erreur);
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingIndex = null;
    const resetPoidsProduit = this.poidsProduitService.cancelEditer();
    this.poidsProduit = this.normalizeFromApi({
      ...resetPoidsProduit,
      id: 0,
      poids: '',
      codePoids: ''
    });
    this.newPoidsProduit = false;
  }

  private resetForm(): void {
    this.poidsProduit = new PoidsProduit();
    this.newPoidsProduit = false;
  }

  private normalizeFromApi(item: any): PoidsProduit {
    return {
      ...item
    };
  }

  private toApiPayload(item: any): PoidsProduit {
    return {
      ...item
    };
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.poidsProduits.length / this.pageSize));
  }

  get paginatedPoidsProduits(): PoidsProduit[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.poidsProduits.slice(start, start + this.pageSize);
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

  trackById(_index: number, item: PoidsProduit): number | string {
    return item?.id ?? _index;
  }

  trackByPage(_index: number, page: number): number {
    return page;
  }
}

