import { Lot } from "./Lot";
import { Silo } from "./Silo";
import { Utilisateur } from "./Utilisateur";
import { Client } from "./Client";
import { TypeProduit } from "./TypeProduit";

export class Produit {
  id: any;
  nom: any;
  quantite: any;
  code: any;
  qualite: any;
  fulmine: any;
  lot: Lot | null;
  lotBag: Lot | null;
  silo: Silo | null;
  client: Client | null;
  operateur: Utilisateur | null;
  typeProduit: TypeProduit | null;
  constructor(init: any) {
    this.id = init ? init.id : "";
    this.nom = init ? init.nom : "";
    this.quantite = init ? init.quantite : "";
    this.code = init ? init.code : "";
    this.qualite = init ? init.qualite : "";
    this.fulmine = init ? init.fulmine : false;
    this.lot = init ? init.lot : null;
    this.lotBag = init ? init.lotBag : null;
    this.silo = init ? init.silo : null;
    this.client = init ? init.client : null;
    this.operateur = init ? init.operateur : null;
    this.typeProduit = init ? init.typeProduit : null;
  }
  
}