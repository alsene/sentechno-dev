import { Injectable, inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from "rxjs/operators";
import { Utilisateur } from "../../model/Utilisateur";
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UtitlisateurService {

  constructor() { }
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // URL de votre API
  utilisateur: Utilisateur = new Utilisateur();
  // Exemple d'un appel GET

  login(email: string, password: string): Observable<Utilisateur>  {
    return this.http
      .post<Utilisateur>(`${this.apiUrl}/api/auth/login`, {email, password})
      .pipe(
         map((result: Utilisateur) => {
          console.log('Utilisateur connecté:', result);
           return result;
         })
      );
  }


  getUtilisateurs(): Observable<Utilisateur[]> {
        return this.http
      .get<Utilisateur[]>(`${this.apiUrl}/api/production/endpoint/administration/v1/afficherUtilisateurs`)
      .pipe(
          map((result: Utilisateur[]) => {
            return result;
          })
      );
  }

  addUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> { {
    return this.http.post<Utilisateur>(`${this.apiUrl}/api/production/endpoint/administration/v1/ajouterUtilisateur`, 
      utilisateur);
    }
  }

  updateUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> { {
    return this.http.post<Utilisateur>(`${this.apiUrl}/api/production/endpoint/administration/v1/modifierUtilisateur`,
      utilisateur);
    }
  }
  removeUtilisateur(utilisateur: Utilisateur) {
    return this.http.post<Utilisateur>(`${this.apiUrl}/api/production/endpoint/administration/v1/supprimerUtilisateur`,
      utilisateur);
  }


  cancelEditer(): any {
    return this.utilisateur;
  }


}
