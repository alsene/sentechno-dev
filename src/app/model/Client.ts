export class Client {
  id: any;
  nom: any;
  email: any;
  telephone: any;
  numero: any;
  rue: any;
  ville: any;
  pays: any;
  codePostal: any;
  
  constructor(init: any) {
    this.id = init ? init.accountId : null;
    this.nom = init ? init.nom : null;
    this.email = init ? init.email : null;
    this.telephone = init ? init.telephone : null;
    this.numero = init ? init.numero : null;
    this.rue = init ? init.rue : null;
    this.ville = init ? init.ville : null;
    this.pays = init ? init.pays : null;
    this.codePostal = init ? init.codePostal : null;
  }
}