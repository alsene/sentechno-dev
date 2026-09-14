import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SiloTypeProduit } from '../../model/SiloTypeProduit';

@Injectable({
  providedIn: 'root'
})
export class SiloTypeProduitService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiUrlProduction = environment.pathApiProduction;
  private siloTypeProduitsRequest$?: Observable<SiloTypeProduit[]>;
  siloTypeProduit: SiloTypeProduit = new SiloTypeProduit();

  constructor() { }

  private invalidateSiloTypeProduitsCache(): void {
    this.siloTypeProduitsRequest$ = undefined;
  }

  getSiloTypeProduits(forceRefresh = false): Observable<SiloTypeProduit[]> {
    if (forceRefresh || !this.siloTypeProduitsRequest$) {
      this.siloTypeProduitsRequest$ = this.http
        .get<SiloTypeProduit[]>(`${this.apiUrl}/${this.apiUrlProduction}/obtenirSiloTypeProduits`)
        .pipe(
          map((result: SiloTypeProduit[]) => result),
          shareReplay(1)
        );
    }

    return this.siloTypeProduitsRequest$;
  }

  addSiloTypeProduit(siloTypeProduit: SiloTypeProduit): Observable<SiloTypeProduit> {
    return this.http
      .post<SiloTypeProduit>(`${this.apiUrl}/${this.apiUrlProduction}/ajouterSiloTypeProduit`, siloTypeProduit)
      .pipe(tap(() => this.invalidateSiloTypeProduitsCache()));
  }

  updateSiloTypeProduit(siloTypeProduit: SiloTypeProduit): Observable<SiloTypeProduit> {
    return this.http
      .post<SiloTypeProduit>(`${this.apiUrl}/${this.apiUrlProduction}/modifierSiloTypeProduit`, siloTypeProduit)
      .pipe(tap(() => this.invalidateSiloTypeProduitsCache()));
  }

  removeSiloTypeProduit(siloTypeProduit: SiloTypeProduit): Observable<SiloTypeProduit> {
    return this.http
      .post<SiloTypeProduit>(`${this.apiUrl}/${this.apiUrlProduction}/supprimerSiloTypeProduit`, siloTypeProduit)
      .pipe(tap(() => this.invalidateSiloTypeProduitsCache()));
  }

  cancelEditer(): SiloTypeProduit {
    return this.siloTypeProduit;
  }
}

