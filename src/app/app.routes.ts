
import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ProduitComponent } from './produit/produit.component';
import { SuiviProduitComponent } from './suivi-produit/suivi-produit.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { LoginComponent } from './login/login.component';
import { QualiteProduitComponent } from './qualite-produit/qualite-produit.component';
import { ProduitTableauBordComponent } from './produit-tableau-bord/produit-tableau-bord.component';
import { ProfilComponent } from './profil/profil/profil.component';

export const routes: Routes = [
  { path: '', component: ProduitComponent },        // Route par défaut
  { path: 'suivi-produit', component: SuiviProduitComponent }, // Autre route
  { path: 'qualite-produit', component: QualiteProduitComponent }, // Autre route
  { path: 'utilisateur', component: UtilisateurComponent }, // Autre route
  { path: 'profil', component: ProfilComponent }, // Autre route
  { path: 'contacts', component: ContactsComponent }, // Autre route
  { path: 'about', component: AboutComponent }, // Autre route
  { path: 'login', component: LoginComponent },
  { path: 'tableau-bord', component: ProduitTableauBordComponent },
  { path: '**', redirectTo: '' }
];
