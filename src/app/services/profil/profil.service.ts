import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Profil } from '../../model/Profil';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private apiUrlAdmin = environment.pathApiAdmin;
  private profilsRequest$?: Observable<Profil[]>;
  profil: Profil = new Profil();

  constructor() { }

  private invalidateProfilsCache(): void {
    this.profilsRequest$ = undefined;
  }

  getProfils(forceRefresh = false): Observable<Profil[]> {
    if (forceRefresh || !this.profilsRequest$) {
      this.profilsRequest$ = this.http
        .get<Profil[]>(`${this.apiUrl}/${this.apiUrlAdmin}/afficherProfils`)
        .pipe(
          map((result: Profil[]) => result),
          shareReplay(1)
        );
    }

    return this.profilsRequest$;
  }

  addProfil(profil: Profil): Observable<Profil> {
    return this.http
      .post<Profil>(`${this.apiUrl}/${this.apiUrlAdmin}/ajouterProfil`, profil)
      .pipe(tap(() => this.invalidateProfilsCache()));
  }

  updateProfil(profil: Profil): Observable<Profil> {
    return this.http
      .post<Profil>(`${this.apiUrl}/${this.apiUrlAdmin}/modifierProfil`, profil)
      .pipe(tap(() => this.invalidateProfilsCache()));
  }

  removeProfil(profil: Profil) {
    return this.http
      .post<Profil>(`${this.apiUrl}/${this.apiUrlAdmin}/supprimerProfil`, profil)
      .pipe(tap(() => this.invalidateProfilsCache()));
  }

  cancelEditer(): any {
    return this.profil;
  }
}
