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
  private siloTypeProduitsBySiloRequest = new Map<number, Observable<SiloTypeProduit[]>>();
  private siloTypeProduitsByTypeRequest = new Map<number, Observable<SiloTypeProduit[]>>();
  siloTypeProduit: SiloTypeProduit = new SiloTypeProduit();

  constructor() { }

  private invalidateSiloTypeProduitsCache(): void {
    this.siloTypeProduitsRequest$ = undefined;
    this.siloTypeProduitsBySiloRequest.clear();
    this.siloTypeProduitsByTypeRequest.clear();
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

  findBySiloId(siloId: number, forceRefresh = false): Observable<SiloTypeProduit[]> {
    if (forceRefresh) {
      this.siloTypeProduitsBySiloRequest.delete(siloId);
    }

    const cachedRequest = this.siloTypeProduitsBySiloRequest.get(siloId);
    if (cachedRequest) {
      return cachedRequest;
    }

    const request$ = this.http
        .get<SiloTypeProduit[]>(`${this.apiUrl}/${this.apiUrlProduction}/findBySiloId?siloId=${siloId}`)
        .pipe(
          map((result: SiloTypeProduit[]) => result),
          shareReplay(1)
        );

    this.siloTypeProduitsBySiloRequest.set(siloId, request$);
    return request$;
  }

  findByTypeProduitId(typeProduitId: number, forceRefresh = false): Observable<SiloTypeProduit[]> {
    if (forceRefresh) {
      this.siloTypeProduitsByTypeRequest.delete(typeProduitId);
    }

    const cachedRequest = this.siloTypeProduitsByTypeRequest.get(typeProduitId);
    if (cachedRequest) {
      return cachedRequest;
    }

    const request$ = this.http
        .get<SiloTypeProduit[]>(`${this.apiUrl}/${this.apiUrlProduction}/findByTypeProduitId?typeProduitId=${typeProduitId}`)
        .pipe(
          map((result: SiloTypeProduit[]) => result),
          shareReplay(1)
        );

    this.siloTypeProduitsByTypeRequest.set(typeProduitId, request$);
    return request$;
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

