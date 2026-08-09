import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TypeProduit } from '../../model/TypeProduit';

@Injectable({
  providedIn: 'root'
})
export class TypeProduitService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
    private apiUrlProduction = environment.pathApiProduction;
  private typesProduitRequest$?: Observable<TypeProduit[]>;
  typeProduit: TypeProduit = new TypeProduit();

  constructor() { }

  private invalidateTypesProduitCache(): void {
    this.typesProduitRequest$ = undefined;
  }

  getTypeProduits(forceRefresh = false): Observable<TypeProduit[]> {
    if (forceRefresh || !this.typesProduitRequest$) {
      this.typesProduitRequest$ = this.http
        .get<TypeProduit[]>(`${this.apiUrl}/${this.apiUrlProduction}/afficherTypeProduits`)
        .pipe(
          map((result: TypeProduit[]) => result),
          shareReplay(1)
        );
    }

    return this.typesProduitRequest$;
  }

  addTypeProduit(typeProduit: TypeProduit): Observable<TypeProduit> {
    return this.http
      .post<TypeProduit>(`${this.apiUrl}/${this.apiUrlProduction}/ajouterTypeProduit`, typeProduit)
      .pipe(tap(() => this.invalidateTypesProduitCache()));
  }

  updateTypeProduit(typeProduit: TypeProduit): Observable<TypeProduit> {
    return this.http
      .post<TypeProduit>(`${this.apiUrl}/${this.apiUrlProduction}/modifierTypeProduit`, typeProduit)
      .pipe(tap(() => this.invalidateTypesProduitCache()));
  }

  removeTypeProduit(typeProduit: TypeProduit): Observable<TypeProduit> {
    return this.http
      .post<TypeProduit>(`${this.apiUrl}/${this.apiUrlProduction}/supprimerTypeProduit`, typeProduit)
      .pipe(tap(() => this.invalidateTypesProduitCache()));
  }

  cancelEditer(): TypeProduit {
    return this.typeProduit;
  }
}
