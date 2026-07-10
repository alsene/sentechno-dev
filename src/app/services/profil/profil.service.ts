import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Profil } from '../../model/Profil';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  profil: Profil = new Profil();

  constructor() { }

  getProfils(): Observable<Profil[]> {
    return this.http
      .get<Profil[]>(`${this.apiUrl}/api/production/endpoint/administration/v1/afficherProfils`)
      .pipe(
        map((result: Profil[]) => result)
      );
  }

  addProfil(profil: Profil): Observable<Profil> {
    return this.http.post<Profil>(`${this.apiUrl}/api/production/endpoint/administration/v1/ajouterProfil`, profil);
  }

  updateProfil(profil: Profil): Observable<Profil> {
    return this.http.post<Profil>(`${this.apiUrl}/api/production/endpoint/administration/v1/modifierProfil`, profil);
  }

  removeProfil(profil: Profil) {
    return this.http.post<Profil>(`${this.apiUrl}/api/production/endpoint/administration/v1/supprimerProfil`, profil);
  }

  cancelEditer(): any {
    return this.profil;
  }
}
