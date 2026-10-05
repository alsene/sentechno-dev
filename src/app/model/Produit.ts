import { Lot } from "./Lot";
import { Silo } from "./Silo";
import { Utilisateur } from "./Utilisateur";
import { Client } from "./Client";
import { TypeProduit } from "./TypeProduit";
import { SiloTypeProduit } from "./SiloTypeProduit";
import { Station } from "./Station";
import { StationLot } from "./StationLot";
import { PoidsProduit } from "./PoidsProduit";
import { CommentaireProduit } from "./CommentaireProduit";

export class Produit {
  id: any;
  nom: any;
  quantite: any;
  code: any;
  qualite: any;
  fulmine: any;
  conforme: any;
  jourJulien: any;
  lot: Lot | null;
  silo: Silo | null;
  client: Client | null;
  operateur: Utilisateur | null;
  siloTypeProduit: SiloTypeProduit | null;
  poidsProduit: PoidsProduit | null;
  station: Station | null;
  stationLot: StationLot | null;
  commentaires: Array<CommentaireProduit>;
  selected: boolean;
  constructor(init: any) {
    this.id = init ? init.id : "";
    this.nom = init ? init.nom : "";
    this.quantite = init ? init.quantite : "";
    this.code = init ? init.code : "";
    this.jourJulien = init ? init.jourJulien : "";
    this.qualite = init ? init.qualite : "";
    this.fulmine = init ? init.fulmine : false;
    this.conforme = init ? init.conforme : false;
    this.lot = init ? init.lot : null;
    this.silo = init ? init.silo : null;
    this.client = init ? init.client : null;
    this.operateur = init ? init.operateur : null;
    this.siloTypeProduit = init ? init.siloTypeProduit : null;
    this.poidsProduit = init ? init.poidsProduit : null;
    this.station = init ? init.station : null;
    this.stationLot = init ? init.stationLot : null;
    this.commentaires = init ? init.commentaires : [];
    this.selected = init ? init.selected : false;
  }

}
