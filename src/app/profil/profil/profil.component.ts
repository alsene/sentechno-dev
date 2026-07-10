import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Profil } from '../../model/Profil';
import { ProfilService } from '../../services/profil/profil.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  auth = inject(AuthService);
  router = inject<any>(Router);

  profil: Profil = new Profil();
  profils: Profil[] = [];
  typeProfilOptions: string[] = ['ASSURANCE_QUALITE', 'CLIENT', 'COMPTABLE', 'FOURNISSEUR', 'GESTIONNAIRE', 'OPERATEUR', 'PARTENAIRE', 'SUPERVISEUR', 'SECRETAIRE'];
  newProfil = false;
  isEditing = false;
  editingIndex: number | null = null;
  pageSize = 10;
  currentPage = 1;

  constructor(private profilService: ProfilService) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.chargerProfils();
  }

  chargerProfils(): void {
    this.profilService.getProfils().subscribe({
      next: (data) => {
        this.profils = data || [];
        this.currentPage = 1;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des profils :', erreur);
      }
    });
  }

  ajouterProfil(): void {
    if (!this.profil.libelle || !this.profil.description || !this.profil.typeProfil) {
      return;
    }
   const payload = this.toApiPayload(this.profil);
    if (this.isEditing && this.editingIndex !== null) {
      this.profilService.updateProfil(payload).subscribe({
        next: (reponse) => {
          this.profils[this.editingIndex!] = this.normalizeUserFromApi(reponse);
          this.cancelEdit();
        },
        error: (erreur) => {
          console.error('Erreur lors de la modification du profil :', erreur);
        }
      });
      return;
    }

    this.profilService.addProfil(this.profil).subscribe({
      next: (reponse) => {
        this.profils.push(this.normalizeUserFromApi(reponse));
        this.currentPage = this.totalPages;
        this.resetForm();
      },
      error: (erreur) => {
        console.error('Erreur lors de l\'ajout du profil :', erreur);
      }
    });
  }

  editProfil(profil: Profil): void {
    this.profil = this.normalizeUserFromApi({ ...profil });
    this.isEditing = true;
    this.editingIndex = this.profils.findIndex((item) => item.id === profil.id);
    this.newProfil = true;
  }

  supprimerProfil(id: number): void {
    const profilASupprimer = this.profils.find((item) => item.id === id);
    if (!profilASupprimer) {
      return;
    }

    this.profilService.removeProfil(profilASupprimer).subscribe({
      next: () => {
        this.profils = this.profils.filter((item) => item.id !== id);
        if (this.isEditing && this.profil.id === id) {
          this.cancelEdit();
        }
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      },
      error: (erreur) => {
        console.error('Erreur lors de la suppression du profil :', erreur);
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingIndex = null;
    const resetProfil = this.profilService.cancelEditer();
    this.profil = this.normalizeUserFromApi({
      ...resetProfil,
      id: 0,
      libelle: '',
      description: '',
      typeProfil: ''
    });
    this.newProfil = false;
  }

  private resetForm(): void {
    this.profil = new Profil();
    this.newProfil = false;
  }
private normalizeUserFromApi(profilage: any): any {
    return {
      ...profilage
    };
  }

  private toApiPayload(profilage: any): any {
    return {
      ...profilage
    };
  }
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.profils.length / this.pageSize));
  }

  get paginatedProfils(): Profil[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.profils.slice(start, start + this.pageSize);
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

}
