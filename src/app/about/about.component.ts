import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe , CommonModule, NgIf } from '@angular/common';
import { AboutService } from '../services/about/about.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  providers: [DatePipe, AboutService]
})
export class AboutComponent{
  auth = inject(AuthService);
  router = inject<any>(Router);
  today;
  info1: any;
  bonjour1: any;

  constructor(private datePipe: DatePipe, private aboutService: AboutService) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.info1 = this.aboutService.getInfos();
    this.bonjour1 = this.aboutService.getBonjour();
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

  
  comments:any []= [];


  comment={
    id: 0,
    message: ''
  };

  newComment = false; // true si on édite, false si on ajoute
  editingIndex: number | null = null;

  addComment() {
    if (this.comment.message !== '') {
      this.comment.id = this.comments.length + 1;
      this.comments.push({
        id: this.comment.id,
        message: this.comment.message
      });
      this.comment = { id: 0, message: '' };
    }
  }

  updateComment() {
    if (this.editingIndex !== null && this.comment.message !== '') {
      this.comments[this.editingIndex].message = this.comment.message;
      this.cancelEdit();
    }
  }

  editComment(comment: any): void {
    this.editingIndex = this.comments.findIndex(c => c.id === comment.id);
    this.comment = { ...comment };
    this.newComment = true;
  }

  cancelEdit() {
    this.newComment = false;
    this.editingIndex = null;
    this.comment = { id: 0, message: '' };
  }

  removeComment(id:number) : void{
    const index = this.comments.findIndex(item => item.id === id);
    this.comments.splice(index,1);
    // Si on supprime le commentaire en cours d'édition, on annule l'édition
    if (this.editingIndex === index) {
      this.cancelEdit();
    }
  }

  // ...existing code...
}
