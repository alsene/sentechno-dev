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
  listeCommentaires:any []= [];
  typeQualiteList: string[] = [];

  responseProduit: any= ResponseProduit;
  listeProduits:Produit [] = [];
  listeCommentaire:CommentaireProduit[] = [];
  typeProduitList: string[] = [];
  listeClients:Array<Client>| [] = [];
  listeLot:Array<Lot>| [] = [];
  listeLotBag:Array<Lot>| [] = [];
  listeSilo:Array<Silo>| [] = [];
  listeTypeProduits:Array<TypeProduit>| [] = [];
  listeQA:Array<Utilisateur>| [] = [];

  produit1: any;
  produit: Produit = new Produit(null);
  commentaireProduit: CommentaireProduit = new CommentaireProduit();

  constructor(private datePipe: DatePipe, private produitService: ProduitService) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.info1 = this.produitService.getInfos();
    this.bonjour1 = this.produitService.getBonjour();
    this.typeQualiteList = this.produitService.getAllQualite();
    this.responseProduit = this.produitService.getProduit1().subscribe({
      next: (data) => {
        this.responseProduit = data;  
        console.log('Produit récupéré:', this.responseProduit);  
        this.listeProduits = this.responseProduit ? this.responseProduit.produits : [];
        this.listeClients =  this.responseProduit ? this.responseProduit.clients : [];
        this.listeLot =  this.responseProduit ? this.responseProduit.lots : [];
        this.listeLotBag =  this.responseProduit ? this.responseProduit.lotBags : [];
        this.listeSilo =  this.responseProduit ? this.responseProduit.silos : [];
        this.listeQA =  this.responseProduit ? this.responseProduit.qaList : [];
        this.listeTypeProduits = this.responseProduit ? this.responseProduit.typeProduits : [];
          console.log('Clients récupérés:', this.listeClients);  
      }
    });

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
    operateur: '',
    qualite: '',
    fulmine: false,
    selected: false
  };


  /*commentaire={
    id: 0,
    codeProduit: '',
    nouveauCommentaire: '',
    assuranceQualite: 'Alex'
  };*/
  
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
      // ensure boolean exists
      if (this.produit.conforme === undefined) this.produit.conforme = false;
      // convert boolean to 'oui'/'non' before sending
      this.produit.conforme = this.produit.conforme ? 'oui' : 'non';
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
    // convert boolean to 'oui'/'non' before updating
    if (this.produit.conforme === undefined) this.produit.conforme = false;
    this.produit.conforme = this.produit.conforme ? 'oui' : 'non';
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
  editCommentaire(comment: CommentaireProduit): void {
    this.editingIndexCommentaire = this.listeCommentaire.findIndex(c => c.id === comment.id);
    const edited = this.produitService.editCommentaire(comment);
    this.commentaireProduit = edited;
    this.newCommentaire = true;
    this.clearCommentaireMessage();
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
       
    // set checkbox according to stored value ('oui' or boolean true)
    this.produit.conforme = (edited.conforme === 'oui' || edited.conforme === true);
    this.listeCommentaire = this.produit && this.produit.commentaires ? this.produit.commentaires : [];
    for (let i = 0; i < this.listeCommentaire.length; i++) {
      const comment = this.listeCommentaire[i];
        console.log('add commentaireProduit:', comment.id, comment.commentaire);  
    }

    this.currentPageCommentaires = 1;
    this.clearCommentaireMessage();

    this.newProduct = true;
  }

  addCommentaire(product: Produit) {
    if (this.produit.code !== '' && this.commentaireProduit.commentaire!='') {
      this.commentaireProduit.produit=this.produit;
      console.log('add commentaireProduit:', this.commentaireProduit);  
      this.commentaireProduit.id = this.listeCommentaire.length + 1;

      this.produitService.addCommentaire1(this.commentaireProduit).subscribe({
        next: (reponse: CommentaireProduit) => {
          if (!this.produit.commentaires) {
            this.produit.commentaires = [];
          }
          this.produit.commentaires.push(reponse);
          this.listeCommentaire = this.produit.commentaires;
          this.currentPageCommentaires = this.totalPagesCommentaires;
          this.commentaireProduit = new CommentaireProduit();
          this.setCommentaireMessage('success', 'Commentaire ajoute avec succes.');
          // La réponse contient généralement le produit avec son ID généré
          console.log('Produit créé avec succès !', reponse);
          console.log('ID attribué par le serveur :', reponse.id);
        },
        error: (erreur) => {
          this.setCommentaireMessage('danger', 'Echec de l ajout du commentaire.');
          console.error('Une erreur est survenue lors de l\'envoi :', erreur);
        }
      });
    } else {
      this.setCommentaireMessage('danger', 'Veuillez saisir un commentaire avant ajout.');
    }
  }

  updateCommentaire() {
    // convert boolean to 'oui'/'non' before updating
    this.produitService.updateCommentaire1(this.commentaireProduit).subscribe({
      next: (reponse: CommentaireProduit) => {
         console.log('Produit mis à jour avec succès !', reponse);
        if (this.editingIndexCommentaire !== null) {
          this.listeCommentaire[this.editingIndexCommentaire] = reponse;
          this.setCommentaireMessage('success', 'Commentaire modifie avec succes.');
          this.cancelEditCommentaire();
        }
      },
      error: (erreur) => {
        this.setCommentaireMessage('danger', 'Echec de la modification du commentaire.');
        console.error('Une erreur est survenue lors de la mise à jour :', erreur);
      }
    });
  }
  removeCommentaire(comment: CommentaireProduit) {
    const index = this.listeCommentaire.findIndex(item => item.id === comment.id);
    this.produitService.removeCommentaire1(comment).subscribe({
      next: () => {
        console.log('Commentaire supprimé');
        this.listeCommentaire.splice(index, 1);
        this.adjustCurrentPageCommentaires();
        // Si on supprime le commentaire en cours d'édition, on annule l'édition
        if (this.editingIndexCommentaire === index) {
          this.cancelEditCommentaire();
        }
      },
      error: (erreur) => {
        console.error('Une erreur est survenue lors de la suppression :', erreur);
      }
    });
  }

  editCommentaire1(comment: CommentaireProduit): void {
    this.editingIndexCommentaire = this.listeCommentaire.findIndex(c => c.id === comment.id);
    const edited = this.produitService.editCommentaire(comment);
    this.commentaireProduit = edited;
    this.newCommentaire = true;
    this.clearCommentaireMessage();
  }

  cancelEdit() {
    this.newProduct = false;
    this.editingIndex = null;
    this.produit = this.produitService.cancelEdit(this.clientList[0] || '');
    this.produit.conforme = (this.produit.conforme === 'oui' || this.produit.conforme === true);
  }
  cancelEditCommentaire() {
    this.newCommentaire = false;
    this.editingIndexCommentaire = null;
    this.commentaireProduit = this.produitService.cancelEditerCommentaire();
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

  /*cancelEditCommentaire() {
    this.newCommentaire = false;
    this.editingIndexCommentaire = null;
    this.commentaire = this.produitService.cancelEditCommentaire(this.clientList[0] || '');
  }*/
 /* updateCommentaire() {
    this.produitService.updateCommentaire(this.listeCommentaires, this.editingIndexCommentaire, this.commentaire);
    if (this.editingIndexCommentaire !== null) {
      this.cancelEditCommentaire();
    }
  }*/
  /*editCommentaire(commentaire: any): void {
    this.editingIndexCommentaire = this.listeCommentaires.findIndex(c => c.id === commentaire.id);
    this.commentaire = this.produitService.editCommentaire(commentaire);
    this.newCommentaire = true;
  }*/
  /*removeCommentaire(id:number) : void{
    const index = this.listeCommentaires.findIndex(item => item.id === id);
    this.produitService.removeCommentaire(this.listeCommentaires, id);
    this.adjustCurrentPageCommentaires();
  }*/
  /*addCommentaire(code: any): void {
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
  }*/
}

