import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UtitlisateurService } from './utilisateur/utitlisateur.service';
import { IdleService } from './idle.service';
import { ProduitService } from './produit/produit.service';
import { Utilisateur } from '../model/Utilisateur';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly utilisateurService = inject(UtitlisateurService);
  private readonly idleService = inject(IdleService);
  private readonly produitService = inject(ProduitService);
  private readonly router = inject(Router);
  private loggedIn = this.hasStoredToken();

  constructor() {
    // déconnexion automatique après 1 minute d'inactivité
    this.idleService.idleTimeout$.subscribe(() => this.logoutForInactivity());
  }

  login(email: string, password: string): Observable<boolean> {
    return this.utilisateurService.login(email, password).pipe(
      tap((utilisateur) => {
        const token = this.extractToken(utilisateur);
        if (token) {
          this.storeToken(token);
        }
        this.idleService.startWatching();
        this.loggedIn = true;
      }),
      map(() => true),
      catchError(() => {
        this.loggedIn = false;
        this.clearToken();
        return of(false);
      })
    );
  }

  logout() {
    this.idleService.stopWatching();
    this.loggedIn = false;
    this.clearToken();
    this.produitService.invalidateProduitsCache();
  }

  private logoutForInactivity(): void {
    if (!this.isLoggedIn()) {
      return;
    }
    this.logout();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.loggedIn || this.hasStoredToken();
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  }

  private hasStoredToken(): boolean {
    return !!this.getToken();
  }

  private storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  private clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  private extractToken(utilisateur: Utilisateur): string | null {
    const candidate = (utilisateur as any)?.token ?? (utilisateur as any)?.accessToken ?? (utilisateur as any)?.jwt;

    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate;
    }

    return null;
  }
}


