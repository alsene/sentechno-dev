import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Silo } from '../../model/Silo';
import { TypeProduit } from '../../model/TypeProduit';
import { SiloTypeProduit } from '../../model/SiloTypeProduit';
import { SiloService } from '../../services/parametrage/silo.service';
import { TypeProduitService } from '../../services/parametrage/type-produit.service';
import { SiloTypeProduitService } from '../../services/parametrage/silo-type-produit.service';

@Component({
  selector: 'app-silo-type-produit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './silo-type-produit.component.html',
  styleUrl: './silo-type-produit.component.css'
})
export class SiloTypeProduitComponent implements OnInit {
  auth = inject(AuthService);
  router = inject<any>(Router);

  siloTypeProduit: SiloTypeProduit = this.createEmptySiloTypeProduit();
  siloTypeProduits: SiloTypeProduit[] = [];
  silos: Silo[] = [];
  typeProduits: TypeProduit[] = [];

  newSiloTypeProduit = false;
  isEditing = false;
  editingIndex: number | null = null;
  pageSize = 10;
  currentPage = 1;

  constructor(
    private siloTypeProduitService: SiloTypeProduitService,
    private siloService: SiloService,
    private typeProduitService: TypeProduitService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.chargerSilos();
    this.chargerTypeProduits();
    this.chargerSiloTypeProduits();
  }

  chargerSilos(): void {
    this.siloService.getSilos().subscribe({
      next: (data) => {
        this.silos = data || [];
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des silos :', erreur);
      }
    });
  }

  chargerTypeProduits(): void {
    this.typeProduitService.getTypeProduits().subscribe({
      next: (data) => {
        this.typeProduits = data || [];
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des types produit :', erreur);
      }
    });
  }

  chargerSiloTypeProduits(): void {
    this.siloTypeProduitService.getSiloTypeProduits().subscribe({
      next: (data) => {
        this.siloTypeProduits = (data || []).map((item) => this.normalizeFromApi(item));
        this.currentPage = 1;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des correspondances silo/type produit :', erreur);
      }
    });
  }

  ajouterSiloTypeProduit(): void {
    if (!this.siloTypeProduit.codeProduit || !this.siloTypeProduit.silo || !this.siloTypeProduit.typeProduit) {
      return;
    }

    const payload = this.toApiPayload(this.siloTypeProduit);
    if (this.isEditing && this.editingIndex !== null) {
      this.siloTypeProduitService.updateSiloTypeProduit(payload).subscribe({
        next: (reponse) => {
          this.siloTypeProduits[this.editingIndex!] = this.normalizeFromApi(reponse);
          this.cancelEdit();
        },
        error: (erreur) => {
          console.error('Erreur lors de la modification de la correspondance :', erreur);
        }
      });
      return;
    }

    this.siloTypeProduitService.addSiloTypeProduit(payload).subscribe({
      next: (reponse) => {
        this.siloTypeProduits.push(this.normalizeFromApi(reponse));
        this.currentPage = this.totalPages;
        this.resetForm();
      },
      error: (erreur) => {
        console.error('Erreur lors de l\'ajout de la correspondance :', erreur);
      }
    });
  }

  editSiloTypeProduit(item: SiloTypeProduit): void {
    this.editingIndex = this.siloTypeProduits.findIndex((it) => it.id === item.id);
    if (this.editingIndex < 0) {
      return;
    }

    const edited = this.normalizeFromApi({ ...item });
    edited.silo = this.matchSiloById(edited.silo);
    edited.typeProduit = this.matchTypeProduitById(edited.typeProduit);

    this.siloTypeProduit = edited;
    this.isEditing = true;
    this.newSiloTypeProduit = true;
  }

  supprimerSiloTypeProduit(id: number): void {
    const itemASupprimer = this.siloTypeProduits.find((item) => item.id === id);
    if (!itemASupprimer) {
      return;
    }

    this.siloTypeProduitService.removeSiloTypeProduit(itemASupprimer).subscribe({
      next: () => {
        this.siloTypeProduits = this.siloTypeProduits.filter((item) => item.id !== id);
        if (this.isEditing && this.siloTypeProduit.id === id) {
          this.cancelEdit();
        }
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      },
      error: (erreur) => {
        console.error('Erreur lors de la suppression de la correspondance :', erreur);
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingIndex = null;
    const resetItem = this.siloTypeProduitService.cancelEditer();
    this.siloTypeProduit = this.normalizeFromApi({
      ...resetItem,
      id: 0,
      codeProduit: '',
      libelle: '',
      silo: null,
      typeProduit: null
    });
    this.newSiloTypeProduit = false;
  }

  getSiloLibelle(silo: any): string {
    if (!silo) {
      return '';
    }

    if (typeof silo === 'object') {
      return silo.libelle || '';
    }

    const siloFound = this.silos.find((item) => item.id === silo);
    return siloFound?.libelle || '';
  }

  getTypeProduitLibelle(typeProduit: any): string {
    if (!typeProduit) {
      return '';
    }

    if (Array.isArray(typeProduit)) {
      return typeProduit.map((item) => item?.libelle).filter(Boolean).join(', ');
    }

    if (typeof typeProduit === 'object') {
      return typeProduit.libelle || '';
    }

    const typeProduitFound = this.typeProduits.find((item) => item.id === typeProduit);
    return typeProduitFound?.libelle || '';
  }

  private matchSiloById(silo: any): Silo | null {
    const siloId = this.extractId(silo);
    if (siloId == null) {
      return null;
    }

    return this.silos.find((item) => item.id === siloId) ?? null;
  }

  private matchTypeProduitById(typeProduit: any): TypeProduit | null {
    const typeProduitId = this.extractId(typeProduit);
    if (typeProduitId == null) {
      return null;
    }

    return this.typeProduits.find((item) => item.id === typeProduitId) ?? null;
  }

  private extractId(value: any): number | string | null {
    if (value == null) {
      return null;
    }

    if (typeof value === 'object') {
      return value.id ?? null;
    }

    return value;
  }

  private resetForm(): void {
    this.siloTypeProduit = this.createEmptySiloTypeProduit();
    this.newSiloTypeProduit = false;
  }

  private createEmptySiloTypeProduit(): SiloTypeProduit {
    return {
      id: 0,
      codeProduit: '',
      libelle: '',
      silo: null,
      typeProduit: null
    };
  }

  private normalizeFromApi(item: any): SiloTypeProduit {
    return {
      id: item?.id ?? 0,
      codeProduit: item?.codeProduit ?? '',
      libelle: item?.libelle ?? '',
      silo: item?.silo ?? null,
      typeProduit: item?.typeProduit ?? null
    };
  }

  private toApiPayload(item: SiloTypeProduit): SiloTypeProduit {
    return {
      id: item.id,
      codeProduit: item.codeProduit,
      libelle: item.libelle,
      silo: item.silo,
      typeProduit: item.typeProduit
    };
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.siloTypeProduits.length / this.pageSize));
  }

  get paginatedSiloTypeProduits(): SiloTypeProduit[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.siloTypeProduits.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_unused, index) => index + 1);
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

  trackById(index: number, item: any): number | string {
    return item?.id ?? index;
  }

  trackByPage(_index: number, page: number): number {
    return page;
  }
}


