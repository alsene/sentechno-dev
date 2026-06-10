import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor() { }
  info={
    nom:"Cheikh Service",
    email:"cfaye@gmail.com",
    tel:"776528001"
  }
  comments:any []= [];

  getInfos(){ 
   return this.info;
  }

  getBonjour(){ 
   return "Gestion des commentaires";
  }

  addComment(c:any){ 
    c.date=new Date();
    this.comments.push(c);
  }

  getAllComments() {
    return this.comments;
  }
}
