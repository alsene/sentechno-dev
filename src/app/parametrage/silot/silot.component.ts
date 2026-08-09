import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Silo } from '../../model/Silo';
import { SilotService } from '../../services/parametrage/silot.service';

@Component({
  selector: 'app-silot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './silot.component.html',
  styleUrl: './silot.component.css'
})
export class SilotComponent implements OnInit {
  auth = inject(AuthService);
  router = inject<any>(Router);

  silo: Silo = new Silo();
  silos: Silo[] = [];
  newSilo = false;
  isEditing = false;
  editingIndex: number | null = null;
  pageSize = 10;
  currentPage = 1;

  constructor(private silotService: SilotService) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.chargerSilos();
  }

  chargerSilos(): void {
    this.silotService.getSilos().subscribe({
      next: (data) => {
        this.silos = data || [];
        this.currentPage = 1;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des silos :', erreur);
      }
    });
  }

  ajouterSilo(): void {
    if (!this.silo.libelle || !this.silo.description) {
      return;
    }

    const payload = this.toApiPayload(this.silo);
    if (this.isEditing && this.editingIndex !== null) {
      this.silotService.updateSilo(payload).subscribe({
        next: (reponse) => {
          this.silos[this.editingIndex!] = this.normalizeFromApi(reponse);
          this.cancelEdit();
        },
        error: (erreur) => {
          console.error('Erreur lors de la modification du silo :', erreur);
        }
      });
      return;
    }

    this.silotService.addSilo(payload).subscribe({
      next: (reponse) => {
        this.silos.push(this.normalizeFromApi(reponse));
        this.currentPage = this.totalPages;
        this.resetForm();
      },
      error: (erreur) => {
        console.error('Erreur lors de l\'ajout du silo :', erreur);
      }
    });
  }

  editSilo(silo: Silo): void {
    this.silo = this.normalizeFromApi({ ...silo });
    this.isEditing = true;
    this.editingIndex = this.silos.findIndex((item) => item.id === silo.id);
    this.newSilo = true;
  }

  supprimerSilo(id: number): void {
    const siloASupprimer = this.silos.find((item) => item.id === id);
    if (!siloASupprimer) {
      return;
    }

    this.silotService.removeSilo(siloASupprimer).subscribe({
      next: () => {
        this.silos = this.silos.filter((item) => item.id !== id);
        if (this.isEditing && this.silo.id === id) {
          this.cancelEdit();
        }
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      },
      error: (erreur) => {
        console.error('Erreur lors de la suppression du silo :', erreur);
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingIndex = null;
    const resetSilo = this.silotService.cancelEditer();
    this.silo = this.normalizeFromApi({
      ...resetSilo,
      id: 0,
      libelle: '',
      description: ''
    });
    this.newSilo = false;
  }

  private resetForm(): void {
    this.silo = new Silo();
    this.newSilo = false;
  }

  private normalizeFromApi(item: any): Silo {
    return {
      ...item
    };
  }

  private toApiPayload(item: any): Silo {
    return {
      ...item
    };
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.silos.length / this.pageSize));
  }

  get paginatedSilos(): Silo[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.silos.slice(start, start + this.pageSize);
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

  trackById(_index: number, item: Silo): number | string {
    return item?.id ?? _index;
  }

  trackByPage(_index: number, page: number): number {
    return page;
  }

}
