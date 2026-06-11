import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe , CommonModule, NgIf } from '@angular/common';
import { ProduitService } from '../services/produit/produit.service';
import { ResponseProduit } from '../model/ResponseProduit';
import { Client } from '../model/Client';
import { Lot } from "../model/Lot";
import { Silo } from "../model/Silo";
import { Utilisateur } from "../model/Utilisateur";

@Component({
  selector: 'app-produit',
  standalone: true,
   imports: [FormsModule, CommonModule, NgIf ],
  templateUrl: './produit.component.html',
  styleUrl: './produit.component.css',
  providers: [DatePipe, ProduitService]
})

export class ProduitComponent {
  auth = inject(AuthService);
  router = inject<any>(Router);
  today;
  info1: any;
  bonjour1: any;
  responseProduit: any = ResponseProduit;
  listeProduits:any []= [];
  typeProduitList: string[] = [];
  listeClients:Array<Client>| null = null;
  listeLot:Array<Lot>| null = null;
  listeLotBag:Array<Lot>| null = null;
  listeSilo:Array<Silo>| null = null;
  listeQA:Array<Utilisateur>| null = null;
  produit1: any;
  ngOnInit(): void {
    /*this.produitService.getProduit1().subscribe({
      next: (data) => {
        this.produit1 = data;
        console.log('Produit récupéré:', this.produit1);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération', err);
      }
    });*/
  }
  constructor(private datePipe: DatePipe, private produitService: ProduitService) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.info1 = this.produitService.getInfos();
    this.bonjour1 = this.produitService.getBonjour();
    this.listeProduits = this.produitService.getAllProduits();
    this.typeProduitList = this.produitService.getAlltypeProduit();
    this.responseProduit = this.produitService.getProduit1().subscribe({
      next: (data) => {
        this.responseProduit = data;  
        console.log('Produit récupéré:', this.responseProduit);  

        this.listeClients =  this.responseProduit ? this.responseProduit.clients : [];
        this.listeLot =  this.responseProduit ? this.responseProduit.lots : [];
        this.listeLotBag =  this.responseProduit ? this.responseProduit.lotBags : [];
        this.listeSilo =  this.responseProduit ? this.responseProduit.silos : [];
        this.listeQA =  this.responseProduit ? this.responseProduit.qaList : [];
          console.log('Clients récupérés:', this.listeClients);  
      }
    });


    if (this.clientList.length > 0) {
      this.produit.client = this.clientList[0];
    }
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

  lotProduitList: string[] = ['Lot 1', 'Lot 2', 'Lot 3', 'Lot 4'];
  lotBigBagList: string[] = ['Lot 1', 'Lot 2', 'Lot 3', 'Lot 4'];
  siloList: string[] = ['Silo 1', 'Silo 2', 'Silo 3', 'Silo 4'];
  clientList: string[] = ['Zinda', 'Alpha', 'Beta', 'Gamma'];

  produit={
    id: 0,
    name: '',
    code: '',
    lotProduit: '',
    lotBigBag: '',
    silo: '',
    client: '',
    quantite: '',
    operateur: 'Said',
    selected: false
  };

  newProduct = false; // true si on édite, false si on ajoute
  editingIndex: number | null = null;
  pageSize = 10;
  currentPage = 1;

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

  addProduct() {
    if (this.produit.code !== '') {
      this.produit.id = this.listeProduits.length + 1;
      this.produitService.addProduct(this.listeProduits, this.produit);
      this.currentPage = this.totalPages;
      this.produit = { id: 0, name: '', code: '', lotProduit: '', lotBigBag: '', silo: '', client: '', quantite: '', operateur: '', selected: false };
    }
  }

  updateProduct() {
    this.produitService.updateProduct(this.listeProduits, this.editingIndex, this.produit);
    if (this.editingIndex !== null) {
      this.cancelEdit();
    }
  }

  get allSelected(): boolean {
    return this.produitService.allSelected(this.listeProduits);
  }

  toggleSelectAll(event: Event): void {
    event.preventDefault();
    this.produitService.toggleSelectAll(this.listeProduits);
  }

  editProduct(product: any): void {
    this.editingIndex = this.listeProduits.findIndex(c => c.id === product.id);
    this.produit = this.produitService.editProduct(product);
    this.newProduct = true;
  }

  cancelEdit() {
    this.newProduct = false;
    this.editingIndex = null;
    this.produit = this.produitService.cancelEdit(this.clientList[0] || '');
  }

  removeProduct(id:number) : void{
    const index = this.listeProduits.findIndex(item => item.id === id);
    this.produitService.removeProduct(this.listeProduits, id);
    this.adjustCurrentPage();
    // Si on supprime le produit en cours d'édition, on annule l'édition
    if (this.editingIndex === index) {
      this.cancelEdit();
    }
  }
}
