import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitService } from './services/produit/produit.service';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FirstApp';
  auth = inject(AuthService);
  produitService = inject(ProduitService);
  menuOpen = false;

  constructor(private router:Router){}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onProduitMenuClick() {
    this.produitService.requestProduitsRefresh();
    this.closeMenu();
  }

  logout() {
    this.auth.logout();
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }

  getDynamicStyles() {
    return {'border': '1px solid black', 'padding': '10px','background-color': 'green','color': 'white','font-size.px': 20};
  }
}
