
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./produit/produit.component').then((m) => m.ProduitComponent) },
  { path: 'suivi-produit', loadComponent: () => import('./suivi-produit/suivi-produit.component').then((m) => m.SuiviProduitComponent) },
  { path: 'qualite-produit', loadComponent: () => import('./qualite-produit/qualite-produit.component').then((m) => m.QualiteProduitComponent) },
  { path: 'utilisateur', loadComponent: () => import('./utilisateur/utilisateur.component').then((m) => m.UtilisateurComponent) },
  { path: 'profil', loadComponent: () => import('./profil/profil/profil.component').then((m) => m.ProfilComponent) },
  { path: 'lot', loadComponent: () => import('./lot-produit/lot-produit.component').then((m) => m.LotProduitComponent) },
  { path: 'silot', loadComponent: () => import('./silo/silo.component').then((m) => m.SiloComponent) },
  { path: 'type-produit', loadComponent: () => import('./type-produit/type-produit.component').then((m) => m.TypeProduitComponent) },
  { path: 'contacts', loadComponent: () => import('./contacts/contacts.component').then((m) => m.ContactsComponent) },
  { path: 'about', loadComponent: () => import('./about/about.component').then((m) => m.AboutComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent) },
  { path: 'tableau-bord', loadComponent: () => import('./produit-tableau-bord/produit-tableau-bord.component').then((m) => m.ProduitTableauBordComponent) },
  { path: '**', redirectTo: '' }
];
