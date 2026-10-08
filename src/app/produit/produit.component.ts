import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe , CommonModule, NgIf } from '@angular/common';
import { ProduitService } from '../services/produit/produit.service';
import { ResponseProduit } from '../model/ResponseProduit';
import { Produit } from "../model/Produit";
import { Client } from '../model/Client';
import { Lot } from "../model/Lot";
import { Silo } from "../model/Silo";
import { Station } from "../model/Station";
import { StationLot } from '../model/StationLot';
import { SiloTypeProduit } from "../model/SiloTypeProduit";
import { PoidsProduit } from "../model/PoidsProduit";
import { Utilisateur } from "../model/Utilisateur";
import { Subscription } from 'rxjs';
import { SiloTypeProduitService } from '../services/parametrage/silo-type-produit.service';
import { StationService } from '../services/parametrage/station.service';
import { PoidsProduitService } from '../services/parametrage/poids-produit.service';
import { StationLotService } from '../services/parametrage/station-lot.service';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf ],
  templateUrl: './produit.component.html',
  styleUrl: './produit.component.css',
  providers: [DatePipe]
})

export class ProduitComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  router = inject<any>(Router);
  today;
  info1: any;
  bonjour1: any;

  produitForm: FormGroup;
  responseProduit: any = ResponseProduit;
  listeProduits:Produit [] = [];
  listeProduitsPourQualite:Produit [] = [];
  listeProduitsPourFulminer:Produit [] = [];
  listeProduitsConforme:Produit [] = [];
  listeProduitsExpedier:Produit [] = [];
  listeProduitsArecycler:Produit [] = [];
  listeClients:Array<Client>| [] = [];
  listeSilo:Array<Silo>| [] = [];
  listeSiloTypeProduits:Array<SiloTypeProduit>| [] = [];
  listePoidsProduits:Array<PoidsProduit>| [] = [];
  listeStations:Array<Station>| [] = [];
  listeStationLots:Array<StationLot>| [] = [];
  listeQA:Array<Utilisateur>| [] = [];
  produit1: any;
  produit: Produit = new Produit(null);
  private refreshSubscription?: Subscription;

  ngOnInit(): void {
    this.refreshSubscription = this.produitService.refreshRequested$.subscribe(() => {
      this.chargerProduits(true);
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  constructor(
    private datePipe: DatePipe,
    private produitService: ProduitService,
    private fb: FormBuilder,
    private siloTypeProduitService: SiloTypeProduitService,
    private stationService: StationService,
    private poidsProduitService: PoidsProduitService,
    private stationLotService: StationLotService
  ) {

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.produitForm = this.fb.group({
      nom: [''],
      prix: ['']
    });


    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.info1 = this.produitService.getInfos();
    this.bonjour1 = this.produitService.getBonjour();
    this.chargerProduits();


    /*if (this.clientList.length > 0) {
      this.produit.client = this.clientList[0];
    }*/
  }

  private chargerProduits(forceRefresh = false): void {
    this.produitService.getProduit1(forceRefresh).subscribe({
      next: (data) => {
        this.responseProduit = data;
        console.log('Produit récupéré:', this.responseProduit);
        this.listeProduits = this.responseProduit ? this.responseProduit.produitsPourQualite : [];
        this.listeProduitsPourQualite = this.responseProduit ? this.responseProduit.produitsPourQualite : [];
        this.listeProduitsPourFulminer = this.responseProduit ? this.responseProduit.produitsPourFulminer : [];
        this.listeProduitsConforme = this.responseProduit ? this.responseProduit.produitsConforme : [];
        this.listeProduitsExpedier = this.responseProduit ? this.responseProduit.produitsExpedier : [];
        this.listeProduitsArecycler = this.responseProduit ? this.responseProduit.produitsArecycler : [];
        this.listeClients =  this.responseProduit ? this.responseProduit.clients : [];
        this.listeSilo =  this.responseProduit ? this.responseProduit.silos : [];
        this.listeQA =  this.responseProduit ? this.responseProduit.qaList : [];
        this.listeSiloTypeProduits = [];
        this.chargerStations();
        this.chargerPoidsProduits();
        console.log('Produits conformes récupérés:', this.listeProduitsConforme);
      }
    });
  }

  private chargerStations(): void {
    this.stationService.getStations().subscribe({
      next: (data) => {
        this.listeStations = data || [];
      },
      error: (erreur) => {
        this.listeStations = [];
        this.produit.station = null;
        console.error('Erreur lors du chargement des stations :', erreur);
      }
    });
  }

  private chargerPoidsProduits(): void {
    this.poidsProduitService.getPoidsProduits().subscribe({
      next: (data) => {
        this.listePoidsProduits = data || [];
      },
      error: (erreur) => {
        this.listePoidsProduits = [];
        this.produit.poidsProduit = null;
        console.error('Erreur lors du chargement des poids produit :', erreur);
      }
    });
  }

  onSiloChange(silo: Silo | null): void {
    this.chargerSiloTypeProduitsParSilo(silo, false, true);
  }

  onStationChange(station: Station | null): void {
    this.chargerStationLotsParStation(station, false, true);
  }


  getStylesBlue() {
    return {
      'padding': '10px',
      'color': 'blue',
      'font-size.px': 20
    };
  }

  info={ nom:"Sene",
    prenom:"Alassane component",
    telephone:"776528001"
  }

  newProduct = false; // true si on édite, false si on ajoute
  editingIndex: number | null = null;
  pageSize = 7;
  currentPage = 1;

  pageSizeConforme = 7;
  currentPageConforme = 1;
  get totalPagesConforme(): number {
    return this.produitService.totalPages(this.listeProduitsConforme, this.pageSizeConforme);
  }
  get pagesConforme(): number[] {
    return this.produitService.pages(this.totalPagesConforme);
  }
  get pagedProduitsConforme(): any[] {
    return this.produitService.pagedProduits(this.listeProduitsConforme, this.currentPageConforme, this.pageSizeConforme);
  }
  changePageConforme(page: number): void {
    this.currentPageConforme = this.produitService.changePage(page, this.totalPagesConforme);
  }
  private adjustCurrentPageConforme(): void {
    this.currentPageConforme = this.produitService.adjustCurrentPage(this.currentPageConforme, this.totalPagesConforme);
  }
  get allSelectedConforme(): boolean {
    return this.produitService.allSelected(this.listeProduitsConforme);
  }
  toggleSelectAllConforme(event: Event): void {
    event.preventDefault();
    this.produitService.toggleSelectAll(this.listeProduitsConforme);
  }
  get totalPages(): number {
    return this.produitService.totalPages(this.listeProduits, this.pageSize);
  }
  get pages(): number[] {
    return this.produitService.pages(this.totalPages);
  }
  get pagedProduits(): any[] {
    return this.produitService.pagedProduits(this.listeProduits, this.currentPage, this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = this.produitService.changePage(page, this.totalPages);
  }

  private adjustCurrentPage(): void {
    this.currentPage = this.produitService.adjustCurrentPage(this.currentPage, this.totalPages);
  }

  get allSelected(): boolean {
    return this.produitService.allSelected(this.listeProduits);
  }

  toggleSelectAll(event: Event): void {
    event.preventDefault();
    this.produitService.toggleSelectAll(this.listeProduits);
  }


  addProduct() {
    if (this.produit.code !== '') {
      console.log('add produit:', this.produit);
      this.produit.id = this.listeProduits.length + 1;
      this.produitService.addProduct1(this.produit).subscribe({
        next: (reponse: Produit) => {
          this.listeProduits.push(reponse); // Ajouter le produit retourné par le serveur à la liste
          // La réponse contient généralement le produit avec son ID généré
          console.log('Produit créé avec succès !', reponse);
          console.log('ID attribué par le serveur :', reponse.id);
          this.cancelEdit();
        },
        error: (erreur) => {
          console.error('Une erreur est survenue lors de l\'envoi :', erreur);
        }
      });
    }
  }

  updateProduct() {
    this.produitService.updateProduct1(this.produit).subscribe({
      next: (reponse: Produit) => {
         console.log('Produit mis à jour avec succès !', reponse);
        if (this.editingIndex !== null) {
          this.listeProduits[this.editingIndex] = reponse;
        }
        this.cancelEdit();
      },
      error: (erreur) => {
        console.error('Une erreur est survenue lors de la mise à jour :', erreur);
      }
    });
  }

  removeProduct(produit: Produit) {
    const index = this.listeProduits.findIndex(item => item.id === produit.id);
    this.produitService.removeProduct1(produit).subscribe({
      next: () => {
        console.log('Produit supprimé');
        this.listeProduits.splice(index, 1);
        this.adjustCurrentPage();
        // Si on supprime le produit en cours d'édition, on annule l'édition
        if (this.editingIndex === index) {
          this.cancelEdit();
        }
      },
      error: (erreur) => {
        console.error('Une erreur est survenue lors de la suppression :', erreur);
      }
    });
  }




  editProduct(product: Produit): void {
    this.editingIndex = this.listeProduits.findIndex(c => c.id === product.id);
    if (this.editingIndex < 0) {
      return;
    }

    const edited = this.produitService.editProduct(product);
    // matcher silo
    if (edited.silo?.id != null) {
      const matchedSilo = this.listeSilo.find(silo => silo.id === edited.silo.id);
      if (matchedSilo) edited.silo = matchedSilo;
    }
    // matcher siloTypeProduit après le chargement filtré par silo
    if (edited.siloTypeProduit?.id != null) {
      const matchedSiloTypeProduit = this.listeSiloTypeProduits.find(stp => stp.id === edited.siloTypeProduit.id);
      if (matchedSiloTypeProduit) edited.siloTypeProduit = matchedSiloTypeProduit;
    }
    // matcher stationLot après le chargement filtré par station
    if (edited.stationLot?.id != null) {
      const matchedStationLot = this.listeStationLots.find(sl => sl.id === edited.stationLot.id);
      console.log('edited stationLot  :', edited.stationLot);
      console.log('edited stationLot id  :', edited.stationLot.lot?.libelle);
      if (matchedStationLot) edited.stationLot = matchedStationLot;
    }else{
      console.log('else edited stationLot  :', edited.stationLot);
    }
    // matcher client
    if (edited.client?.id != null) {
      const matchedClient = this.listeClients.find(c => c.id === edited.client.id);
      if (matchedClient) edited.client = matchedClient;
    }
    // matcher station
    if (edited.station?.id != null) {
      const matchedStation = this.listeStations.find(station => station.id === edited.station.id);
      if (matchedStation) edited.station = matchedStation;
    }
    // matcher poidsProduit
    if (edited.poidsProduit?.id != null) {
      const matchedPoidsProduit = this.listePoidsProduits.find(poidsProduit => poidsProduit.id === edited.poidsProduit.id);
      if (matchedPoidsProduit) edited.poidsProduit = matchedPoidsProduit;
    }
    this.produit = edited;
    this.newProduct = true;
    this.chargerSiloTypeProduitsParSilo(this.produit.silo, true);
    this.chargerStationLotsParStation(this.produit.station, true);
  }

  cancelEdit() {
    this.newProduct = false;
    this.editingIndex = null;
    // réinitialiser le modèle Produit pour que les selects affichent l'option par défaut
    const newProduit = new Produit(null);
    newProduit.stationLot = null;
    newProduit.silo = null;
    newProduit.siloTypeProduit = null;
    newProduit.client = null;
    newProduit.station = null;
    newProduit.poidsProduit = null;
    this.produit = newProduit;
    this.listeSiloTypeProduits = [];
    this.listeStationLots = [];
  }

  private chargerSiloTypeProduitsParSilo(silo: Silo | null, keepSelection = false, forceRefresh = false): void {
    const siloId = this.extractId(silo);

    if (siloId == null) {
      this.listeSiloTypeProduits = [];
      this.produit.siloTypeProduit = null;
      return;
    }

    this.siloTypeProduitService.findBySiloId(siloId, forceRefresh).subscribe({
      next: (data) => {
        this.listeSiloTypeProduits = data || [];

        if (keepSelection) {
          const siloTypeProduitId = this.extractId(this.produit.siloTypeProduit);
          const matchedSiloTypeProduit = this.listeSiloTypeProduits.find(item => item.id === siloTypeProduitId) ?? null;
          this.produit.siloTypeProduit = matchedSiloTypeProduit;
          return;
        }

        this.produit.siloTypeProduit = null;
      },
      error: (erreur) => {
        this.listeSiloTypeProduits = [];
        this.produit.siloTypeProduit = null;
        console.error('Erreur lors du chargement des produits du silo :', erreur);
      }
    });
  }

  private chargerStationLotsParStation(station: Station | null, keepSelection = false, forceRefresh = false): void {
    const stationId = this.extractId(station);

    if (stationId == null) {
      this.listeStationLots = [];
      this.produit.stationLot = null;
      return;
    }

    this.stationLotService.findByStationId(stationId, forceRefresh).subscribe({
      next: (data) => {
        this.listeStationLots = data || [];

        if (keepSelection) {
          const stationLotId = this.extractId(this.produit?.stationLot);
          const matchedStationLot = this.listeStationLots.find(item => item.id === stationLotId) ?? null;
          this.produit.stationLot = matchedStationLot;
          return;
        }
        this.produit.stationLot = null;
      },
      error: (erreur) => {
        this.listeStationLots = [];
        this.produit.stationLot = null;
        console.error('Erreur lors du chargement des lots de la station :', erreur);
      }
    });
  }

  private extractId(item: any): number | null {
    if (item == null) {
      return null;
    }

    if (typeof item === 'object' && item.id != null) {
      return Number(item.id);
    }

    const numericValue = Number(item);
    return Number.isNaN(numericValue) ? null : numericValue;
  }

  removeProduct1(id:number) : void{
    const index = this.listeProduits.findIndex(item => item.id === id);
    this.produitService.removeProduct(this.listeProduits, id);
    this.adjustCurrentPage();
    // Si on supprime le produit en cours d'édition, on annule l'édition
    if (this.editingIndex === index) {
      this.cancelEdit();
    }
  }

  trackById(_index: number, item: any): number | string {
    return item?.id ?? item?.code ?? _index;
  }

  trackByPage(_index: number, page: number): number {
    return page;
  }

  private escapeHtml(value: any): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  imprimerProduits(): void {
    if (this.listeProduits.length === 0) {
      return;
    }
    const printWindow = window.open('', '_blank', 'width=1000,height=700');
    if (!printWindow) {
      return;
    }

    const rows = this.listeProduits.map(p => `
      <tr>
        <td>${this.escapeHtml(p.code)}</td>
        <td>${this.escapeHtml(p.nom)}</td>
        <td>${this.escapeHtml(p.lot?.numeroProduction)}</td>
        <td>${this.escapeHtml(p.silo?.libelle)}</td>
        <td>${this.escapeHtml(p.client?.nom)}</td>
        <td>${this.escapeHtml(p.quantite)}</td>
        <td>${this.escapeHtml(p.operateur?.nom)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Produits en cours</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h2 { text-align: center; margin-bottom: 4px; }
            p.meta { text-align: center; margin-top: 0; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #999; padding: 6px 8px; font-size: 13px; text-align: left; }
            th { background: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Produits emballés en big bags (CCP2) - En cours</h2>
          <p class="meta">Date d'impression : ${this.escapeHtml(this.today)}</p>
          <table>
            <thead>
              <tr>
                <th>Code</th><th>Nom</th><th>Lot</th><th>Bag</th><th>Silo</th><th>Client</th><th>Quantité</th><th>Opérateur</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }

}
