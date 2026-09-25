
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./produit/produit.component').then((m) => m.ProduitComponent) },
  { path: 'suivi-produit', loadComponent: () => import('./suivi-produit/suivi-produit.component').then((m) => m.SuiviProduitComponent) },
  { path: 'qualite-produit', loadComponent: () => import('./qualite-produit/qualite-produit.component').then((m) => m.QualiteProduitComponent) },
  { path: 'utilisateur', loadComponent: () => import('./utilisateur/utilisateur.component').then((m) => m.UtilisateurComponent) },
  { path: 'profil', loadComponent: () => import('./profil/profil/profil.component').then((m) => m.ProfilComponent) },
  { path: 'configuration', loadComponent: () => import('./parametrage/configuration/configuration.component').then((m) => m.ConfigurationComponent) },
  { path: 'lot', loadComponent: () => import('./parametrage/lot/lot.component').then((m) => m.LotComponent) },
  { path: 'silo', loadComponent: () => import('./parametrage/silo/silo.component').then((m) => m.SiloComponent) },
  { path: 'type-produit', loadComponent: () => import('./parametrage/type-produit/type-produit.component').then((m) => m.TypeProduitComponent) },
  { path: 'silo-type-produit', loadComponent: () => import('./parametrage/silo-type-produit/silo-type-produit.component').then((m) => m.SiloTypeProduitComponent) },
  { path: 'station', loadComponent: () => import('./parametrage/station/station.component').then((m) => m.StationComponent) },
  { path: 'poids-produit', loadComponent: () => import('./parametrage/poids-produit/poids-produit.component').then((m) => m.PoidsProduitComponent) },
  { path: 'contacts', loadComponent: () => import('./contacts/contacts.component').then((m) => m.ContactsComponent) },
  { path: 'about', loadComponent: () => import('./about/about.component').then((m) => m.AboutComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent) },
  { path: 'tableau-bord', loadComponent: () => import('./produit-tableau-bord/produit-tableau-bord.component').then((m) => m.ProduitTableauBordComponent) },
  { path: 'workflow-employe', loadComponent: () => import('./workflow-employe/workflow-employe.component').then((m) => m.WorkflowEmployeComponent) },
  { path: '**', redirectTo: '' }
];
