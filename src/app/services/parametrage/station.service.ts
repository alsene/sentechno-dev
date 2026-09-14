import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Station } from '../../model/Station';

@Injectable({
  providedIn: 'root'
})
export class StationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiUrlProduction = environment.pathApiProduction;
  private stationsRequest$?: Observable<Station[]>;
  station: Station = new Station();

  constructor() { }

  private invalidateStationsCache(): void {
    this.stationsRequest$ = undefined;
  }

  getStations(forceRefresh = false): Observable<Station[]> {
    if (forceRefresh || !this.stationsRequest$) {
      this.stationsRequest$ = this.http
        .get<Station[]>(`${this.apiUrl}/${this.apiUrlProduction}/obtenirStations`)
        .pipe(
          map((result: Station[]) => result),
          shareReplay(1)
        );
    }

    return this.stationsRequest$;
  }

  addStation(station: Station): Observable<Station> {
    return this.http
      .post<Station>(`${this.apiUrl}/${this.apiUrlProduction}/ajouterStation`, station)
      .pipe(tap(() => this.invalidateStationsCache()));
  }

  updateStation(station: Station): Observable<Station> {
    return this.http
      .post<Station>(`${this.apiUrl}/${this.apiUrlProduction}/modifierStation`, station)
      .pipe(tap(() => this.invalidateStationsCache()));
  }

  removeStation(station: Station): Observable<Station> {
    return this.http
      .post<Station>(`${this.apiUrl}/${this.apiUrlProduction}/supprimerStation`, station)
      .pipe(tap(() => this.invalidateStationsCache()));
  }

  cancelEditer(): Station {
    return this.station;
  }
}

