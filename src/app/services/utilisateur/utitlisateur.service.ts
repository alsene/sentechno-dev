import { Injectable, inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from "rxjs/operators";
import { Utilisateur } from "../../model/Utilisateur";
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UtitlisateurService {

  constructor() { }
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // URL de votre API
    private apiUrlAdmin = environment.pathApiAdmin;
  private utilisateursRequest$?: Observable<Utilisateur[]>;
  utilisateur: Utilisateur = new Utilisateur();
  // Exemple d'un appel GET

  private invalidateUtilisateursCache(): void {
    this.utilisateursRequest$ = undefined;
  }

  login(email: string, password: string): Observable<Utilisateur>  {
    return this.http
      .post<Utilisateur>(`${this.apiUrl}/api/auth/login`, {email, password})
      .pipe(
         map((result: Utilisateur) => {
           return result;
         })
      );
  }


  getUtilisateurs(forceRefresh = false): Observable<Utilisateur[]> {
    if (forceRefresh || !this.utilisateursRequest$) {
      this.utilisateursRequest$ = this.http
        .get<Utilisateur[]>(`${this.apiUrl}/${this.apiUrlAdmin}/afficherUtilisateurs`)
        .pipe(
          map((result: Utilisateur[]) => {
            return result;
          }),
          shareReplay(1)
        );
    }

    return this.utilisateursRequest$;
  }

  addUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> { {
    return this.http
      .post<Utilisateur>(`${this.apiUrl}/${this.apiUrlAdmin}/ajouterUtilisateur`, utilisateur)
      .pipe(tap(() => this.invalidateUtilisateursCache()));
    }
  }

  updateUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> { {
    return this.http
      .post<Utilisateur>(`${this.apiUrl}/${this.apiUrlAdmin}/modifierUtilisateur`, utilisateur)
      .pipe(tap(() => this.invalidateUtilisateursCache()));
    }
  }
  removeUtilisateur(utilisateur: Utilisateur) {
    return this.http
      .post<Utilisateur>(`${this.apiUrl}/${this.apiUrlAdmin}/supprimerUtilisateur`, utilisateur)
      .pipe(tap(() => this.invalidateUtilisateursCache()));
  }


  cancelEditer(): any {
    return this.utilisateur;
  }


}
