import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Silo } from '../../model/Silo';

@Injectable({
  providedIn: 'root'
})
export class SilotService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
    private apiUrlProduction = environment.pathApiProduction;
  private silosRequest$?: Observable<Silo[]>;
  silo: Silo = new Silo();

  constructor() { }

  private invalidateSilosCache(): void {
    this.silosRequest$ = undefined;
  }

  getSilos(forceRefresh = false): Observable<Silo[]> {
    if (forceRefresh || !this.silosRequest$) {
      this.silosRequest$ = this.http
        .get<Silo[]>(`${this.apiUrl}/${this.apiUrlProduction}/obtenirSilos`)
        .pipe(
          map((result: Silo[]) => result),
          shareReplay(1)
        );
    }

    return this.silosRequest$;
  }

  addSilo(silo: Silo): Observable<Silo> {
    return this.http
      .post<Silo>(`${this.apiUrl}/${this.apiUrlProduction}/ajouterSilo`, silo)
      .pipe(tap(() => this.invalidateSilosCache()));
  }

  updateSilo(silo: Silo): Observable<Silo> {
    return this.http
      .post<Silo>(`${this.apiUrl}/${this.apiUrlProduction}/modifierSilo`, silo)
      .pipe(tap(() => this.invalidateSilosCache()));
  }

  removeSilo(silo: Silo): Observable<Silo> {
    return this.http
      .post<Silo>(`${this.apiUrl}/${this.apiUrlProduction}/supprimerSilo`, silo)
      .pipe(tap(() => this.invalidateSilosCache()));
  }

  cancelEditer(): Silo {
    return this.silo;
  }
}
