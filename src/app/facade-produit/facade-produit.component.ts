import { Component, inject, OnInit } from '@angular/core';
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
import { TypeProduit } from "../model/TypeProduit";
import { Utilisateur } from "../model/Utilisateur";

@Component({
  selector: 'app-facade-produit',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf ],
  templateUrl: './facade-produit.component.html',
  styleUrl: './facade-produit.component.css',
  providers: [DatePipe, ProduitService]
})
export class FacadeProduitComponent {

  auth = inject(AuthService);
  router = inject<any>(Router);
  today;
  info1: any;
  bonjour1: any;
  typeProduit: TypeProduit = new TypeProduit();

  produitForm: FormGroup;
  responseProduit: any = ResponseProduit;
  listeProduits:Produit [] = [];
  listeProduitsPourQualite:Produit [] = [];
  listeProduitsPourFulminer:Produit [] = [];
  listeProduitsConforme:Produit [] = [];
  listeProduitsExpedier:Produit [] = [];
  listeProduitsArecycler:Produit [] = [];
  typeProduitList: string[] = [];
  listeClients:Array<Client>| [] = [];
  listeLot:Array<Lot>| [] = [];
  listeLotBag:Array<Lot>| [] = [];
  listeSilo:Array<Silo>| [] = [];
  listeTypeProduits:Array<TypeProduit>| [] = [];
  listeQA:Array<Utilisateur>| [] = [];
  produit1: any;
  produit: Produit = new Produit(null);
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
  constructor(private datePipe: DatePipe, private produitService: ProduitService, private fb: FormBuilder) {

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
    this.typeProduitList = this.produitService.getAlltypeProduit();
    this.responseProduit = this.produitService.getProduit1().subscribe({
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
        this.listeLot =  this.responseProduit ? this.responseProduit.lots : [];
        this.listeLotBag =  this.responseProduit ? this.responseProduit.lotBags : [];
        this.listeSilo =  this.responseProduit ? this.responseProduit.silos : [];
        this.listeQA =  this.responseProduit ? this.responseProduit.qaList : [];
        this.listeTypeProduits = this.responseProduit ? this.responseProduit.typeProduits : [];
          console.log('Produits conformes récupérés:', this.listeProduitsConforme);  
      }
    });

 
    /*if (this.clientList.length > 0) {
      this.produit.client = this.clientList[0];
    }*/
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

  produit2={
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
          this.cancelEdit();
        }
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
    const edited = this.produitService.editProduct(product);
    // matcher typeProduit
    if (edited.typeProduit?.id != null) {
      const matchedType = this.listeTypeProduits.find(t => t.id === edited.typeProduit.id);
      if (matchedType) edited.typeProduit = matchedType;
    }
    // matcher lot
    if (edited.lot?.id != null) {
      const matchedLot = this.listeLot.find(lot => lot.id === edited.lot.id);
      if (matchedLot) edited.lot = matchedLot;
    }
    // matcher lotBag
    if (edited.lotBag?.id != null) {
      const matchedLotBag = this.listeLotBag.find(lotBag => lotBag.id === edited.lotBag.id);
      if (matchedLotBag) edited.lotBag = matchedLotBag;
    }
    // matcher silo
    if (edited.silo?.id != null) {
      const matchedSilo = this.listeSilo.find(silo => silo.id === edited.silo.id);
      if (matchedSilo) edited.silo = matchedSilo;
    }
    // matcher client
    if (edited.client?.id != null) {
      const matchedClient = this.listeClients.find(c => c.id === edited.client.id);
      if (matchedClient) edited.client = matchedClient;
    }
    this.produit = edited;
    this.newProduct = true;
  }

  cancelEdit() {
    this.newProduct = false;
    this.editingIndex = null;
    // réinitialiser le modèle Produit pour que les selects affichent l'option par défaut
    const newProduit = new Produit(null);
    newProduit.typeProduit = null;
    newProduit.lot = null;
    newProduit.lotBag = null;
    newProduit.silo = null;
    newProduit.client = null;
    this.produit = newProduit;
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

}