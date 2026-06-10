import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe , CommonModule, NgIf } from '@angular/common';
import { ProduitService } from '../services/produit/produit.service';


@Component({
  selector: 'app-suivi-produit',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf ],
  templateUrl: './suivi-produit.component.html',
  styleUrl: './suivi-produit.component.css',
  providers: [DatePipe, ProduitService]
})
export class SuiviProduitComponent {
  auth = inject(AuthService);
  router = inject<any>(Router);
  today;
  info1: any;
  bonjour1: any;
  listeProduits:any []= [];
  listeCommentaires:any []= [];
  typeQualiteList: string[] = [];
  typeProduitList: string[] = [];

  constructor(private datePipe: DatePipe, private produitService: ProduitService) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.info1 = this.produitService.getInfos();
    this.bonjour1 = this.produitService.getBonjour();
    this.listeProduits = this.produitService.getAllProduits();
    this.typeQualiteList = this.produitService.getAllQualite();
    this.typeProduitList = this.produitService.getAlltypeProduit();
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
    operateur: '',
    qualite: '',
    fulmine: false,
    selected: false
  };


  commentaire={
    id: 0,
    codeProduit: '',
    nouveauCommentaire: '',
    assuranceQualite: 'Alex'
  };
  
  newProduct = false; // true si on édite, false si on ajoute
  editingIndex: number | null = null;
  pageSize = 10;
  currentPage = 1;
  editingIndexCommentaire: number | null = null;
  newCommentaire = false; // true si on édite, false si on ajoute
  pageSizeCommentaires = 5;
  currentPageCommentaires = 1;

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
      this.produit = { id: 0, name: '', code: '', lotProduit: '', lotBigBag: '', silo: '', client: '', quantite: '', operateur: '', qualite: '', fulmine: false, selected: false };
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
    this.getAllCommentsByProduct(product.code);
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

  suiviProduit = {
    numero: '',
    nom: '',
    code: '',
    lotProduit: '',
    lotBigBag: '',
    silo: '',
    client: '',
    quantite: '',
    operateur: ''
  };

  listeSuiviProduits: any[] = [];
  comments: { text: string; date: Date }[] = [];

  nouveauCommentaire: string = '';

  get totalPagesCommentaires(): number {
    return this.produitService.totalPagesCommentaires(this.listeCommentaires, this.pageSizeCommentaires);
  }

  get pagesCommentaires(): number[] {
    return this.produitService.pagesCommentaires(this.totalPagesCommentaires);
  }

  get pagedCommentaires(): any[] {
    return this.produitService.pagedCommentaires(this.listeCommentaires, this.currentPageCommentaires, this.pageSizeCommentaires);
  }

  changePageCommentaires(page: number): void {
    this.currentPageCommentaires = this.produitService.changeCommentaires(page, this.totalPagesCommentaires);
  }

  private adjustCurrentPageCommentaires(): void {
    this.currentPageCommentaires = this.produitService.adjustCurrentPageCommentaires(this.currentPageCommentaires, this.totalPagesCommentaires);
  }
   getAllCommentsByProduct(codeProduit: string): void {
    this.listeCommentaires = this.produitService.getAllCommentsByProduct(codeProduit);
  }

  cancelEditCommentaire() {
    this.newCommentaire = false;
    this.editingIndexCommentaire = null;
    this.commentaire = this.produitService.cancelEditCommentaire(this.clientList[0] || '');
  }
  updateCommentaire() {
    this.produitService.updateCommentaire(this.listeCommentaires, this.editingIndexCommentaire, this.commentaire);
    if (this.editingIndexCommentaire !== null) {
      this.cancelEditCommentaire();
    }
  }
  editCommentaire(commentaire: any): void {
    this.editingIndexCommentaire = this.listeCommentaires.findIndex(c => c.id === commentaire.id);
    this.commentaire = this.produitService.editCommentaire(commentaire);
    this.newCommentaire = true;
  }
  removeCommentaire(id:number) : void{
    const index = this.listeCommentaires.findIndex(item => item.id === id);
    this.produitService.removeCommentaire(this.listeCommentaires, id);
    this.adjustCurrentPageCommentaires();
  }
  addCommentaire(code: any): void {
    if (this.commentaire.nouveauCommentaire !== '') {
      this.commentaire.nouveauCommentaire = this.commentaire.nouveauCommentaire;
      this.commentaire.assuranceQualite = this.commentaire.assuranceQualite;
      this.commentaire.codeProduit = code;
      this.commentaire.id = this.listeCommentaires.length + 1;
      this.produitService.ajouterCommentaire(this.listeCommentaires, this.commentaire, code);
      this.currentPageCommentaires = this.totalPagesCommentaires;
      console.log('Commentaire ajouté:', this.commentaire);
      this.commentaire = { id: 0, codeProduit: '', nouveauCommentaire: '', assuranceQualite: 'Alex' };

    }
  }
}

