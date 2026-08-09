import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Lot } from '../../model/Lot';

@Injectable({
  providedIn: 'root'
})
export class LotService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiUrlProduction = environment.pathApiProduction;
  private lotsRequest$?: Observable<Lot[]>;
  lot: Lot = new Lot();

  constructor() { }

  private invalidateLotsCache(): void {
    this.lotsRequest$ = undefined;
  }

  getLots(forceRefresh = false): Observable<Lot[]> {
    if (forceRefresh || !this.lotsRequest$) {
      this.lotsRequest$ = this.http
        .get<Lot[]>(`${this.apiUrl}/${this.apiUrlProduction}/afficherLots`)
        .pipe(
          map((result: Lot[]) => result),
          shareReplay(1)
        );
    }

    return this.lotsRequest$;
  }

  addLot(lot: Lot): Observable<Lot> {
    return this.http
      .post<Lot>(`${this.apiUrl}/${this.apiUrlProduction}/ajouterLot`, lot)
      .pipe(tap(() => this.invalidateLotsCache()));
  }

  updateLot(lot: Lot): Observable<Lot> {
    return this.http
      .post<Lot>(`${this.apiUrl}/${this.apiUrlProduction}/modifierLot`, lot)
      .pipe(tap(() => this.invalidateLotsCache()));
  }

  removeLot(lot: Lot): Observable<Lot> {
    return this.http
      .post<Lot>(`${this.apiUrl}/${this.apiUrlProduction}/supprimerLot`, lot)
      .pipe(tap(() => this.invalidateLotsCache()));
  }

  cancelEditer(): Lot {
    return this.lot;
  }
}
