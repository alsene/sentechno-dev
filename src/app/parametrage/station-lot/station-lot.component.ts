import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Station } from '../../model/Station';
import { Lot } from '../../model/Lot';
import { StationLot } from '../../model/StationLot';
import { StationService } from '../../services/parametrage/station.service';
import { LotService } from '../../services/parametrage/lot.service';
import { StationLotService } from '../../services/parametrage/station-lot.service';

@Component({
  selector: 'app-station-lot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './station-lot.component.html',
  styleUrl: './station-lot.component.css'
})
export class StationLotComponent implements OnInit {
  auth = inject(AuthService);
  router = inject<any>(Router);

  stationLot: StationLot = this.createEmptyStationLot();
  stationLots: StationLot[] = [];
  stations: Station[] = [];
  lots: Lot[] = [];

  isEditing = false;
  editingIndex: number | null = null;
  pageSize = 10;
  currentPage = 1;

  constructor(
    private stationLotService: StationLotService,
    private stationService: StationService,
    private lotService: LotService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.chargerStations();
    this.chargerLots();
    this.chargerStationLots();
  }

  chargerStations(): void {
    this.stationService.getStations().subscribe({
      next: (data) => {
        this.stations = data || [];
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des stations :', erreur);
      }
    });
  }

  chargerLots(): void {
    this.lotService.getLots().subscribe({
      next: (data) => {
        this.lots = data || [];
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des lots :', erreur);
      }
    });
  }

  chargerStationLots(): void {
    this.stationLotService.getStationLots().subscribe({
      next: (data) => {
        this.stationLots = (data || []).map((item) => this.normalizeFromApi(item));
        this.currentPage = 1;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des correspondances station/lot :', erreur);
      }
    });
  }

  ajouterStationLot(): void {
    if (!this.stationLot.station || !this.stationLot.lot) {
      return;
    }

    const payload = this.toApiPayload(this.stationLot);

    if (this.isEditing && this.editingIndex !== null) {
      this.stationLotService.updateStationLot(payload).subscribe({
        next: (reponse) => {
          this.stationLots[this.editingIndex!] = this.normalizeFromApi(reponse);
          this.cancelEdit();
        },
        error: (erreur) => {
          console.error('Erreur lors de la modification de la correspondance :', erreur);
        }
      });
      return;
    }

    this.stationLotService.addStationLot(payload).subscribe({
      next: (reponse) => {
        this.stationLots.push(this.normalizeFromApi(reponse));
        this.currentPage = this.totalPages;
        this.resetForm();
      },
      error: (erreur) => {
        console.error('Erreur lors de l\'ajout de la correspondance :', erreur);
      }
    });
  }

  editStationLot(item: StationLot): void {
    this.editingIndex = this.stationLots.findIndex((it) => it.id === item.id);
    if (this.editingIndex < 0) {
      return;
    }

    const edited = this.normalizeFromApi({ ...item });
    edited.station = this.matchStationById(edited.station);
    edited.lot = this.matchLotById(edited.lot);

    this.stationLot = edited;
    this.isEditing = true;
  }

  supprimerStationLot(id: number): void {
    const itemASupprimer = this.stationLots.find((item) => item.id === id);
    if (!itemASupprimer) {
      return;
    }

    this.stationLotService.removeStationLot(itemASupprimer).subscribe({
      next: () => {
        this.stationLots = this.stationLots.filter((item) => item.id !== id);
        if (this.isEditing && this.stationLot.id === id) {
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
    const resetItem = this.stationLotService.cancelEditer();
    this.stationLot = this.normalizeFromApi({
      ...resetItem,
      id: 0,
      station: null,
      lot: null
    });
  }

  getStationLibelle(station: any): string {
    if (!station) {
      return '';
    }

    if (typeof station === 'object') {
      return station.libelle || '';
    }

    const stationFound = this.stations.find((item) => item.id === station);
    return stationFound?.libelle || '';
  }

  getLotLibelle(lot: any): string {
    if (!lot) {
      return '';
    }

    if (typeof lot === 'object') {
      return lot.libelle || '';
    }

    const lotFound = this.lots.find((item) => item.id === lot);
    return lotFound?.libelle || '';
  }

  private matchStationById(station: any): Station | null {
    const stationId = this.extractId(station);
    if (stationId == null) {
      return null;
    }

    return this.stations.find((item) => item.id === stationId) ?? null;
  }

  private matchLotById(lot: any): Lot | null {
    const lotId = this.extractId(lot);
    if (lotId == null) {
      return null;
    }

    return this.lots.find((item) => item.id === lotId) ?? null;
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
    this.stationLot = this.createEmptyStationLot();
  }

  private createEmptyStationLot(): StationLot {
    return {
      id: 0,
      station: null,
      lot: null,
      libelle: ''
    };
  }

  private normalizeFromApi(item: any): StationLot {
    return {
      id: item?.id ?? 0,
      station: item?.station ?? null,
      lot: item?.lot ?? null,
      libelle: item?.libelle ?? ''
    };
  }

  private toApiPayload(item: StationLot): StationLot {
    return {
      id: item.id,
      station: item.station,
      lot: item.lot,
      libelle: item.libelle
    };
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.stationLots.length / this.pageSize));
  }

  get paginatedStationLots(): StationLot[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.stationLots.slice(start, start + this.pageSize);
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


