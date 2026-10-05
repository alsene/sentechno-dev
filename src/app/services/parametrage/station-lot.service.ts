import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StationLot } from '../../model/StationLot';

@Injectable({
  providedIn: 'root'
})
export class StationLotService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiUrlProduction = environment.pathApiProduction;
  private stationLotsRequest$?: Observable<StationLot[]>;
  private stationLotsByStationRequest = new Map<number, Observable<StationLot[]>>();
  stationLot: StationLot = new StationLot();

  constructor() { }

  private invalidateStationLotsCache(): void {
    this.stationLotsRequest$ = undefined;
    this.stationLotsByStationRequest.clear();
  }

  getStationLots(forceRefresh = false): Observable<StationLot[]> {
    if (forceRefresh || !this.stationLotsRequest$) {
      this.stationLotsRequest$ = this.http
        .get<StationLot[]>(`${this.apiUrl}/${this.apiUrlProduction}/obtenirStationLots`)
        .pipe(
          map((result: StationLot[]) => result),
          shareReplay(1)
        );
    }

    return this.stationLotsRequest$;
  }

  addStationLot(stationLot: StationLot): Observable<StationLot> {
    return this.http
      .post<StationLot>(`${this.apiUrl}/${this.apiUrlProduction}/ajouterStationLot`, stationLot)
      .pipe(tap(() => this.invalidateStationLotsCache()));
  }

  findByStationId(stationId: number, forceRefresh = false): Observable<StationLot[]> {
    if (forceRefresh) {
      this.stationLotsByStationRequest.delete(stationId);
    }

    const cachedRequest = this.stationLotsByStationRequest.get(stationId);
    if (cachedRequest) {
      return cachedRequest;
    }

    const request$ = this.http
      .get<StationLot[]>(`${this.apiUrl}/${this.apiUrlProduction}/findByStationId?stationId=${stationId}`)
      .pipe(
        map((result: StationLot[]) => result),
        shareReplay(1)
      );

    this.stationLotsByStationRequest.set(stationId, request$);
    return request$;
  }

  updateStationLot(stationLot: StationLot): Observable<StationLot> {
    return this.http
      .post<StationLot>(`${this.apiUrl}/${this.apiUrlProduction}/modifierStationLot`, stationLot)
      .pipe(tap(() => this.invalidateStationLotsCache()));
  }

  removeStationLot(stationLot: StationLot): Observable<StationLot> {
    return this.http
      .post<StationLot>(`${this.apiUrl}/${this.apiUrlProduction}/supprimerStationLot`, stationLot)
      .pipe(tap(() => this.invalidateStationLotsCache()));
  }

  cancelEditer(): StationLot {
    return this.stationLot;
  }
}



