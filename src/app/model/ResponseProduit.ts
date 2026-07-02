
import { Produit } from "./Produit";
import { Lot } from "./Lot";
import { Silo } from "./Silo";
import { Utilisateur } from "./Utilisateur";
import { Client } from "./Client";
import { TypeProduit } from "./TypeProduit";

export class ResponseProduit {

produits: Array<Produit>;
lots: Array<Lot>;
lotBags: Array<Lot>;
silos: Array<Silo>;
clients: Array<Client>;
qaList: Array<Utilisateur>;
typeProduits: Array<TypeProduit>;
qualites: Array<String>;
  constructor(init: any) {
    this.produits = init ? init.produits : [];
    this.lots = init ? init.lots : [];
    this.lotBags = init ? init.lotBags : [];
    this.silos = init ? init.silos : [];
    this.clients = init ? init.clients : [];
    this.qaList = init ? init.qaList : [];
    this.typeProduits = init ? init.typeProduits : [];
    this.qualites = init ? init.qualites : [];
  }
}




