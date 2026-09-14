import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PoidsProduit } from '../../model/PoidsProduit';

@Injectable({
  providedIn: 'root'
})
export class PoidsProduitService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiUrlProduction = environment.pathApiProduction;
  private poidsProduitsRequest$?: Observable<PoidsProduit[]>;
  poidsProduit: PoidsProduit = new PoidsProduit();

  constructor() { }

  private invalidatePoidsProduitsCache(): void {
    this.poidsProduitsRequest$ = undefined;
  }

  getPoidsProduits(forceRefresh = false): Observable<PoidsProduit[]> {
    if (forceRefresh || !this.poidsProduitsRequest$) {
      this.poidsProduitsRequest$ = this.http
        .get<PoidsProduit[]>(`${this.apiUrl}/${this.apiUrlProduction}/obtenirPoidsProduits`)
        .pipe(
          map((result: PoidsProduit[]) => result),
          shareReplay(1)
        );
    }

    return this.poidsProduitsRequest$;
  }

  addPoidsProduit(poidsProduit: PoidsProduit): Observable<PoidsProduit> {
    return this.http
      .post<PoidsProduit>(`${this.apiUrl}/${this.apiUrlProduction}/ajouterPoidsProduit`, poidsProduit)
      .pipe(tap(() => this.invalidatePoidsProduitsCache()));
  }

  updatePoidsProduit(poidsProduit: PoidsProduit): Observable<PoidsProduit> {
    return this.http
      .post<PoidsProduit>(`${this.apiUrl}/${this.apiUrlProduction}/modifierPoidsProduit`, poidsProduit)
      .pipe(tap(() => this.invalidatePoidsProduitsCache()));
  }

  removePoidsProduit(poidsProduit: PoidsProduit): Observable<PoidsProduit> {
    return this.http
      .post<PoidsProduit>(`${this.apiUrl}/${this.apiUrlProduction}/supprimerPoidsProduit`, poidsProduit)
      .pipe(tap(() => this.invalidatePoidsProduitsCache()));
  }

  cancelEditer(): PoidsProduit {
    return this.poidsProduit;
  }
}

