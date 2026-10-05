import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LotComponent } from '../lot/lot.component';
import { SiloComponent } from '../silo/silo.component';
import { SiloTypeProduitComponent } from '../silo-type-produit/silo-type-produit.component';
import { StationComponent } from '../station/station.component';
import { TypeProduitComponent } from '../type-produit/type-produit.component';
import { PoidsProduitComponent } from '../poids-produit/poids-produit.component';
import { StationLotComponent } from '../station-lot/station-lot.component';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    CommonModule,
    LotComponent,
    SiloComponent,
    SiloTypeProduitComponent,
    StationComponent,
    TypeProduitComponent,
    PoidsProduitComponent,
    StationLotComponent
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {
  activeSection = 'lot';
  auth = inject(AuthService);
  router = inject<any>(Router);

  constructor() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  showSection(section: string): void {
    if (section === this.activeSection) {
      // Force la recreation du composant pour rejouer ngOnInit et recharger les donnees.
      this.activeSection = '';
      setTimeout(() => {
        this.activeSection = section;
      });
      return;
    }

    this.activeSection = section;
  }
}
