
import { Produit } from "./Produit";
import { Lot } from "./Lot";
import { Silo } from "./Silo";
import { Utilisateur } from "./Utilisateur";
import { Client } from "./Client";

export class ResponseProduit {

produits: Array<Produit>| null;
lots: Array<Lot>| null;
lotBags: Array<Lot>| null;
silos: Array<Silo>| null;
clients: Array<Client>| null;
qaList: Array<Utilisateur>| null;

  constructor(init: any) {
    this.produits = init ? init.produits : null;
    this.lots = init ? init.lots : null;
    this.lotBags = init ? init.lotBags : null;
    this.silos = init ? init.silos : null;
    this.clients = init ? init.clients : null;
    this.qaList = init ? init.qaList : null;
  }
}




