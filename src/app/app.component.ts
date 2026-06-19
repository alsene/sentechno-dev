import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ProduitComponent } from './produit/produit.component';

import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuiviProduitComponent } from './suivi-produit/suivi-produit.component';
import { QualiteProduitComponent } from './qualite-produit/qualite-produit.component';
import { ProduitFulmineComponent } from './produit-fulmine/produit-fulmine.component';
import { ProduitTableauBordComponent } from './produit-tableau-bord/produit-tableau-bord.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule, ProduitComponent, UtilisateurComponent, SuiviProduitComponent, QualiteProduitComponent,
    ProduitFulmineComponent, ProduitTableauBordComponent, AboutComponent, ContactsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FirstApp';
  auth = inject(AuthService);
  constructor(private router:Router){}


  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getDynamicStyles() {
    return {'border': '1px solid black', 'padding': '10px','background-color': 'green','color': 'white','font-size.px': 20};
  }
}
