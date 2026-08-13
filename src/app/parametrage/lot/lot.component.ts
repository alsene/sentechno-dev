import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Lot } from '../../model/Lot';
import { LotService } from '../../services/parametrage/lot.service';

@Component({
  selector: 'app-lot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lot.component.html',
  styleUrl: './lot.component.css'
})
export class LotComponent implements OnInit {
  auth = inject(AuthService);
  router = inject<any>(Router);

  lot: Lot = new Lot();
  lots: Lot[] = [];
  newLot = false;
  isEditing = false;
  editingIndex: number | null = null;
  pageSize = 10;
  currentPage = 1;
  typeLots: string[] = ['PRODUIT', 'BIG_BAG'];

  constructor(private lotService: LotService) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.chargerLots();
  }

  chargerLots(): void {
    this.lotService.getLots().subscribe({
      next: (data) => {
        this.lots = data || [];
        this.currentPage = 1;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des lots :', erreur);
      }
    });
  }

  ajouterLot(): void {
    if (!this.lot.libelle || !this.lot.description) {
      return;
    }

    const payload = this.toApiPayload(this.lot);
    if (this.isEditing && this.editingIndex !== null) {
      this.lotService.updateLot(payload).subscribe({
        next: (reponse) => {
          this.lots[this.editingIndex!] = this.normalizeFromApi(reponse);
          this.cancelEdit();
        },
        error: (erreur) => {
          console.error('Erreur lors de la modification du lot :', erreur);
        }
      });
      return;
    }

    this.lotService.addLot(payload).subscribe({
      next: (reponse) => {
        this.lots.push(this.normalizeFromApi(reponse));
        this.currentPage = this.totalPages;
        this.resetForm();
      },
      error: (erreur) => {
        console.error('Erreur lors de l\'ajout du lot :', erreur);
      }
    });
  }

  editLot(lot: Lot): void {
    this.lot = this.normalizeFromApi({ ...lot });
    this.isEditing = true;
    this.editingIndex = this.lots.findIndex((item) => item.id === lot.id);
    this.newLot = true;
  }

  supprimerLot(id: number): void {
    const lotASupprimer = this.lots.find((item) => item.id === id);
    if (!lotASupprimer) {
      return;
    }

    this.lotService.removeLot(lotASupprimer).subscribe({
      next: () => {
        this.lots = this.lots.filter((item) => item.id !== id);
        if (this.isEditing && this.lot.id === id) {
          this.cancelEdit();
        }
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      },
      error: (erreur) => {
        console.error('Erreur lors de la suppression du lot :', erreur);
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingIndex = null;
    const resetLot = this.lotService.cancelEditer();
    this.lot = this.normalizeFromApi({
      ...resetLot,
      id: 0,
      libelle: '',
      description: ''
    });
    this.newLot = false;
  }

  private resetForm(): void {
    this.lot = new Lot();
    this.newLot = false;
  }

  private normalizeFromApi(item: any): Lot {
    return {
      ...item
    };
  }

  private toApiPayload(item: any): Lot {
    return {
      ...item
    };
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.lots.length / this.pageSize));
  }

  get paginatedLots(): Lot[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.lots.slice(start, start + this.pageSize);
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

  trackById(_index: number, item: Lot): number | string {
    return item?.id ?? _index;
  }

  trackByPage(_index: number, page: number): number {
    return page;
  }
  trackByValue(_index: number, value: string): string {
    return value;
  }
}
