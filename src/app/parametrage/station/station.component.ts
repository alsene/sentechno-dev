import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Station } from '../../model/Station';
import { StationService } from '../../services/parametrage/station.service';

@Component({
  selector: 'app-station',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './station.component.html',
  styleUrl: './station.component.css'
})
export class StationComponent implements OnInit {
  auth = inject(AuthService);
  router = inject<any>(Router);

  station: Station = new Station();
  stations: Station[] = [];
  typeStations: string[] = ['PRODUIT', 'BIG_BAG', 'SHIFT'];
  newStation = false;
  isEditing = false;
  editingIndex: number | null = null;
  pageSize = 10;
  currentPage = 1;

  constructor(private stationService: StationService) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.chargerStations();
  }

  chargerStations(): void {
    this.stationService.getStations().subscribe({
      next: (data) => {
        this.stations = data || [];
        this.currentPage = 1;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des stations :', erreur);
      }
    });
  }

  ajouterStation(): void {
    if (!this.station.libelle || !this.station.typeStation) {
      return;
    }

    const payload = this.toApiPayload(this.station);
    if (this.isEditing && this.editingIndex !== null) {
      this.stationService.updateStation(payload).subscribe({
        next: (reponse) => {
          this.stations[this.editingIndex!] = this.normalizeFromApi(reponse);
          this.cancelEdit();
        },
        error: (erreur) => {
          console.error('Erreur lors de la modification de la station :', erreur);
        }
      });
      return;
    }

    this.stationService.addStation(payload).subscribe({
      next: (reponse) => {
        this.stations.push(this.normalizeFromApi(reponse));
        this.currentPage = this.totalPages;
        this.resetForm();
      },
      error: (erreur) => {
        console.error('Erreur lors de l\'ajout de la station :', erreur);
      }
    });
  }

  editStation(station: Station): void {
    this.station = this.normalizeFromApi({ ...station });
    this.isEditing = true;
    this.editingIndex = this.stations.findIndex((item) => item.id === station.id);
    this.newStation = true;
  }

  supprimerStation(id: number): void {
    const stationASupprimer = this.stations.find((item) => item.id === id);
    if (!stationASupprimer) {
      return;
    }

    this.stationService.removeStation(stationASupprimer).subscribe({
      next: () => {
        this.stations = this.stations.filter((item) => item.id !== id);
        if (this.isEditing && this.station.id === id) {
          this.cancelEdit();
        }
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      },
      error: (erreur) => {
        console.error('Erreur lors de la suppression de la station :', erreur);
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingIndex = null;
    const resetStation = this.stationService.cancelEditer();
    this.station = this.normalizeFromApi({
      ...resetStation,
      id: 0,
      libelle: '',
      typeStation: ''
    });
    this.newStation = false;
  }

  private resetForm(): void {
    this.station = new Station();
    this.newStation = false;
  }

  private normalizeFromApi(item: any): Station {
    return {
      ...item
    };
  }

  private toApiPayload(item: any): Station {
    return {
      ...item
    };
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.stations.length / this.pageSize));
  }

  get paginatedStations(): Station[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.stations.slice(start, start + this.pageSize);
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

  trackById(_index: number, item: Station): number | string {
    return item?.id ?? _index;
  }

  trackByPage(_index: number, page: number): number {
    return page;
  }

  trackByValue(_index: number, value: string): string {
    return value ?? _index.toString();
  }
}
