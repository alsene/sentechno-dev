import { Injectable, inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from "rxjs/operators";
import { ResponseProduit } from '../../model/ResponseProduit';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

 constructor() { }

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081'; // URL de votre API

  // Exemple d'un appel GET
  getProduit1(): Observable<ResponseProduit> {
        return this.http
      .get<ResponseProduit>(`${this.apiUrl}/api/production/endpoint/produit/v1/assurance-qualite/VERT`)
      .pipe(
         map((result: ResponseProduit) => {
           return result;
         })
      );
  }
  login(email: string, password: string): Observable<ResponseProduit>  {
    return this.http
      .get<ResponseProduit>(`${this.apiUrl}/api/production/endpoint/produit/v1/assurance-qualite/VERT`)
      .pipe(
         map((result: ResponseProduit) => {
           return result;
         })
      );
  }
  getProduit1_old(): Observable<ResponseProduit> {
    return this.http.get<ResponseProduit>(`${this.apiUrl}/api/production/endpoint/produit/v1/assurance-qualite/VERT`);
  }
   getProduit2(): Observable<ResponseProduit> {
     return this.http.get<ResponseProduit>('URL_API');
   }
  // Exemple d'un appel POST
  ajouterDonnee(nouvelleDonnee: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/donnees`, nouvelleDonnee);
  }

  info={
    nom:"Cheikh Service",
    email:"cfaye@gmail.com",
    tel:"776528001"
  }
  listeProduits:any []= [];

  getInfos(){
   return this.info;
  }

  getBonjour(){
   return "Gestion des commentaires";
  }

  addComment(c:any){
    c.date=new Date();
    this.listeProduits.push(c);
  }

   private qualiteList: string[] = ['Moyenne Qualité', 'Bonne Qualité', 'Qualité Standard'];
   getAllQualite() {
    return this.qualiteList;
  }

 private typeProduitList: string[] = ['Couscous regulier', 'Couscous naturel', 'Perles regulieres', 'Perles naturelles'];
   getAlltypeProduit() {
    return this.typeProduitList;
  }
  
  private produits = [
    { id: 1, name: 'Couscous regulier', code: '100', lotProduit: 'Lot 1', lotBigBag: 'Lot 1', silo: 'Silo 1', client: 'Zinda', quantite: 100, operateur: 'Said', qualite: 'Standard', fulmine: false },
    { id: 2, name: 'Couscous naturel', code: '101', lotProduit: 'Lot 1', lotBigBag: 'Lot 1', silo: 'Silo 1', client: 'Alpha', quantite: 100, operateur: 'Said', qualite: 'Haute', fulmine: true },
    { id: 3, name: 'Couscous regulier', code: '102', lotProduit: 'Lot 1', lotBigBag: 'Lot 1', silo: 'Silo 1', client: 'Beta', quantite: 200, operateur: 'Said', qualite: 'Standard', fulmine: false },
    { id: 4, name: 'Couscous naturel', code: '103', lotProduit: 'Lot 1', lotBigBag: 'Lot 1', silo: 'Silo 1', client: 'Gamma', quantite: 300, operateur: 'Said', qualite: 'Haute', fulmine: true },
    { id: 5, name: 'Perles naturel', code: '104', lotProduit: 'Lot 1', lotBigBag: 'Lot 1', silo: 'Silo 1', client: 'Zinda', quantite: 50, operateur: 'Said', qualite: 'Standard', fulmine: false },
    { id: 6, name: 'Perles regulier', code: '105', lotProduit: 'Lot 1', lotBigBag: 'Lot 1', silo: 'Silo 1', client: 'Beta', quantite: 100, operateur: 'Said', qualite: 'Haute', fulmine: true },
    { id: 7, name: 'Couscous regulier', code: '106', lotProduit: 'Lot 1', lotBigBag: 'Lot 1', silo: 'Silo 1', client: 'Gamma', quantite: 60, operateur: 'Said', qualite: 'Standard', fulmine: false },
    { id: 8, name: 'Couscous regulier', code: '107', lotProduit: 'Lot 1', lotBigBag: 'Lot 1', silo: 'Silo 1', client: 'Zinda', quantite: 1000, operateur: 'Said', qualite: 'Haute', fulmine: true },
    { id: 9, name: 'Couscous regulier', code: '108', lotProduit: 'Lot 1', lotBigBag: 'Lot 1', silo: 'Silo 1', client: 'Zinda', quantite: 500, operateur: 'Said', qualite: 'Standard', fulmine: false }
  ];

  private commentaires = [
    { id: 1, codeProduit: '100', nouveauCommentaire: 'Commentaire pour le produit 100',assuranceQualite: 'Alex', qualite: 'Bonne Qualité' },
    { id: 2, codeProduit: '101', nouveauCommentaire: 'Commentaire pour le produit 101',assuranceQualite: 'Alex', qualite: 'Moyenne Qualité' }
  ];

  getAllProduits() {
    return this.produits.sort((a, b) => parseInt(a.code) - parseInt(b.code));
  }

  getAllCommentsByProduct(codeProduit: string) {
    return this.commentaires.filter(c => c.codeProduit === codeProduit);
  }
  totalPages(list: any[], pageSize: number): number {
    return Math.max(1, Math.ceil(list.length / pageSize));
  }

  pages(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pagedProduits(list: any[], currentPage: number, pageSize: number): any[] {
    const start = (currentPage - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }

  changePage(page: number, totalPages: number): number {
    if (page < 1) {
      page = 1;
    }
    if (page > totalPages) {
      page = totalPages;
    }
    return page;
  }

  adjustCurrentPage(currentPage: number, totalPages: number): number {
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    if (currentPage < 1) {
      currentPage = 1;
    }
    return currentPage;
  }


  
  getProduits() {
    return this.produits;
  }

  addProduct(produits: any[], produit: any): void {
    if (produit.code !== '') {
      produit.id = produits.length + 1;
      produits.push({
        id: produit.id,
        name: produit.name,
        code: produit.code,
        lotProduit: produit.lotProduit,
        lotBigBag: produit.lotBigBag,
        silo: produit.silo,
        client: produit.client,
        quantite: produit.quantite,
        operateur: produit.operateur,
        qualite: produit.qualite,
        fulmine: produit.fulmine,
        selected: produit.selected || false
      });
    }
  }

  updateProduct(list: any[], editingIndex: number | null, produit: any): void {
    if (editingIndex !== null && produit.code !== '') {
      list[editingIndex].name = produit.name;
      list[editingIndex].code = produit.code;
      list[editingIndex].lotProduit = produit.lotProduit;
      list[editingIndex].lotBigBag = produit.lotBigBag;
      list[editingIndex].silo = produit.silo;
      list[editingIndex].client = produit.client;
      list[editingIndex].quantite = produit.quantite;
      list[editingIndex].operateur = produit.operateur;
      list[editingIndex].qualite = produit.qualite;
      list[editingIndex].fulmine = produit.fulmine;
      list[editingIndex].selected = produit.selected;
    }
  }

  updateCommentaire(list: any[], editingIndex: number | null, commentaire: any): void {
    if (editingIndex !== null && commentaire.nouveauCommentaire !== '' && commentaire.qualite !== '') {
      list[editingIndex].nouveauCommentaire = commentaire.nouveauCommentaire;
      list[editingIndex].assuranceQualite = commentaire.assuranceQualite;
      list[editingIndex].qualite = commentaire.qualite;
    }
  }
  
  allSelected(list: any[]): boolean {
    return list.length > 0 && list.every(item => item.selected);
  }

  toggleSelectAll(list: any[]): void {
    const shouldSelect = !this.allSelected(list);
    list.forEach(item => item.selected = shouldSelect);
  }

  editProduct(product: any): any {
    return { ...product };
  }

  cancelEdit(defaultClient: string): any {
    return {
      id: 0,
      name: '',
      code: '',
      lotProduit: '',
      lotBigBag: '',
      silo: '',
      client: defaultClient,
      quantite: '',
      operateur: '',
      qualite: '',
      fulmine: false,
      selected: false
    };
  }

   cancelEditCommentaire(defaultClient: string): any {
    return {
      id: 0,
      codeProduit: '',
      nouveauCommentaire: '',
      assuranceQualite: '',
      qualite: ''
    };
  }
  removeProduct(list: any[], id: number): void {
    const index = list.findIndex(item => item.id === id);
    if (index >= 0) {
      list.splice(index, 1);
    }
  }

  editCommentaire(commentaire: any): any {
    return { ...commentaire };
  }
  removeCommentaire(list: any[], id: number): void {
    const index = list.findIndex(item => item.id === id);
    if (index >= 0) {
      list.splice(index, 1);
    }
  }
  totalPagesCommentaires(list: any[], pageSize: number): number {
    return Math.max(1, Math.ceil(list.length / pageSize));
  }
  pagesCommentaires(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pagedCommentaires(list: any[], currentPage: number, pageSize: number): any[] {
    const start = (currentPage - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }

  changeCommentaires(page: number, totalPages: number): number {
    if (page < 1) {
      page = 1;
    }
    if (page > totalPages) {
      page = totalPages;
    }
    return page;
  }

  adjustCurrentPageCommentaires(currentPage: number, totalPages: number): number {
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    if (currentPage < 1) {
      currentPage = 1;
    }
    return currentPage;
  }
  ajouterCommentaire(commentaires: any[], commentaire: any , code: any): void {
    if (commentaire.nouveauCommentaire !== '' && commentaire.qualite !== '') {
      commentaire.id = commentaires.length + 1;
      commentaires.push({
        id: commentaire.id,
        codeProduit: code,
        nouveauCommentaire: commentaire.nouveauCommentaire,
        assuranceQualite: commentaire.assuranceQualite,
        qualite: commentaire.qualite
      });
    }
  }
}

