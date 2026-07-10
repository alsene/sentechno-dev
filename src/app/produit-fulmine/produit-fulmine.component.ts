import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe , CommonModule, NgIf } from '@angular/common';
import { ProduitService } from '../services/produit/produit.service';
import { ResponseProduit } from '../model/ResponseProduit';
import { Produit } from "../model/Produit";
import { Client } from '../model/Client';
import { Lot } from "../model/Lot";
import { Silo } from "../model/Silo";
import { TypeProduit } from "../model/TypeProduit";
import { Utilisateur } from "../model/Utilisateur";
import { CommentaireProduit } from "../model/CommentaireProduit";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-produit-fulmine',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf ],
  templateUrl: './produit-fulmine.component.html',
  styleUrl: './produit-fulmine.component.css',
  providers: [DatePipe, ProduitService]
})
export class ProduitFulmineComponent {
  auth = inject(AuthService);
  router = inject<any>(Router);
   today;
  listeCommentaires:any []= [];
  typeQualiteList: string[] = [];

  responseProduit: any= ResponseProduit;
  listeProduits:Produit [] = [];
  listeProduitsPourQualite:Produit [] = [];
  listeProduitsPourFulminer:Produit [] = [];
  listeProduitsConforme:Produit [] = [];
  listeProduitsFulminer:Produit [] = [];
  listeProduitsExpedier:Produit [] = [];
  listeProduitsArecycler:Produit [] = [];
  listeCommentaire:CommentaireProduit[] = [];
  typeProduitList: string[] = [];
  listeClients:Array<Client>| [] = [];
  listeLot:Array<Lot>| [] = [];
  listeLotBag:Array<Lot>| [] = [];
  listeSilo:Array<Silo>| [] = [];
  listeTypeProduits:Array<TypeProduit>| [] = [];
  listeQA:Array<Utilisateur>| [] = [];
  produit: Produit = new Produit(null);

  private loadProduits(): void {
    this.produitService.getProduit1().subscribe({
      next: (data) => {
        this.responseProduit = data;
        this.listeProduits = this.responseProduit ? this.responseProduit.produitsPourQualite : [];
        this.listeProduitsPourQualite = this.responseProduit ? this.responseProduit.produitsPourQualite : [];
        this.listeProduitsPourFulminer = this.responseProduit ? this.responseProduit.produitsPourFulminer : [];
        this.listeProduitsConforme = this.responseProduit ? this.responseProduit.produitsConforme : [];
        this.listeProduitsFulminer = this.responseProduit ? this.responseProduit.produitsFulminer : [];
        this.listeProduitsExpedier = this.responseProduit ? this.responseProduit.produitsExpedier : [];
        this.listeProduitsArecycler = this.responseProduit ? this.responseProduit.produitsArecycler : [];
        this.listeClients = this.responseProduit ? this.responseProduit.clients : [];
        this.listeLot = this.responseProduit ? this.responseProduit.lots : [];
        this.listeLotBag = this.responseProduit ? this.responseProduit.lotBags : [];
        this.listeSilo = this.responseProduit ? this.responseProduit.silos : [];
        this.listeQA = this.responseProduit ? this.responseProduit.qaList : [];
        this.listeTypeProduits = this.responseProduit ? this.responseProduit.typeProduits : [];
        this.currentPage = this.produitService.adjustCurrentPage(this.currentPage, this.totalPages);
        this.currentPageConforme = this.produitService.adjustCurrentPage(this.currentPageConforme, this.totalPagesConforme);
      }
    });
  }

  constructor(private datePipe: DatePipe, private produitService: ProduitService) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.loadProduits();
  }
  newProduct = false; // true si on édite, false si on ajoute
  editingIndex: number | null = null;
  pageSize = 10;
  currentPage = 1;
  editingIndexCommentaire: number | null = null;
  newCommentaire = false; // true si on édite, false si on ajoute
  pageSizeCommentaires = 5;
  currentPageCommentaires = 1;
  commentaireMessage = '';
  commentaireMessageType: 'success' | 'danger' | '' = '';

  private setCommentaireMessage(type: 'success' | 'danger', message: string): void {
    this.commentaireMessageType = type;
    this.commentaireMessage = message;
  }

  private clearCommentaireMessage(): void {
    this.commentaireMessageType = '';
    this.commentaireMessage = '';
  }

  get totalPages(): number {
    return this.produitService.totalPages(this.listeProduitsPourFulminer, this.pageSize);
  }

  get pages(): number[] {
    return this.produitService.pages(this.totalPages);
  }

  get pagedProduits(): any[] {
    return this.produitService.pagedProduits(this.listeProduitsPourFulminer, this.currentPage, this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = this.produitService.changePage(page, this.totalPages);
  }

  private adjustCurrentPage(): void {
    this.currentPage = this.produitService.adjustCurrentPage(this.currentPage, this.totalPages);
  }

  get allSelected(): boolean {
    return this.produitService.allSelected(this.listeProduitsPourFulminer);
  }

  toggleSelectAll(event: Event): void {
    event.preventDefault();
    this.produitService.toggleSelectAll(this.listeProduitsPourFulminer);
  }
  pageSizeConforme = 7;
  currentPageConforme = 1;
  get totalPagesConforme(): number { 
    return this.produitService.totalPages(this.listeProduitsFulminer, this.pageSizeConforme);
  }
  get pagesConforme(): number[] {
    return this.produitService.pages(this.totalPagesConforme);
  }
  get pagedProduitsConforme(): any[] {
    return this.produitService.pagedProduits(this.listeProduitsFulminer, this.currentPageConforme, this.pageSizeConforme);
  }
  changePageConforme(page: number): void {
    this.currentPageConforme = this.produitService.changePage(page, this.totalPagesConforme);
  }
  private adjustCurrentPageConforme(): void {
    this.currentPageConforme = this.produitService.adjustCurrentPage(this.currentPageConforme, this.totalPagesConforme);
  }
  get allSelectedConforme(): boolean {
    return this.produitService.allSelected(this.listeProduitsFulminer);
  }
  toggleSelectAllConforme(event: Event): void {
    event.preventDefault();
    this.produitService.toggleSelectAll(this.listeProduitsFulminer);
  }


  updateProduct() {
    const produitsSelectionnes = this.listeProduitsPourFulminer.filter((produit) => produit.selected);

    if (produitsSelectionnes.length === 0) {
      console.warn('Aucun produit sélectionné pour la mise à jour.');
      return;
    }

    const requetes = produitsSelectionnes.map((produit) =>
      this.produitService.updateProduct1({ ...produit, fulmine: true })
    );

    forkJoin(requetes).subscribe({
      next: (reponses: Produit[]) => {
        console.log('Produits mis à jour avec succès !', reponses);
        this.loadProduits();
      },
      error: (erreur) => {
        console.error('Une erreur est survenue lors de la mise à jour :', erreur);
      }
    });
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
    return this.produitService.totalPagesCommentaires(this.listeCommentaire, this.pageSizeCommentaires);
  }

  get pagesCommentaires(): number[] {
    return this.produitService.pagesCommentaires(this.totalPagesCommentaires);
  }

  get pagedCommentaires(): any[] {
    return this.produitService.pagedCommentaires(this.listeCommentaire, this.currentPageCommentaires, this.pageSizeCommentaires);
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
  
}

