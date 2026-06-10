import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-utilisateur',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.css'
})
export class UtilisateurComponent {
  utilisateur = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    pays: '',
    ville: '',
    codePostale: '',
    telephone: '',
    compagnie: ''
  };

  utilisateurs: any[] = [];
  isEditing = false;
  editingIndex: number | null = null;

  ajouterUtilisateur() {
    if (this.utilisateur.nom && this.utilisateur.prenom && this.utilisateur.email) {
      if (this.isEditing && this.editingIndex !== null) {
        // Mode édition
        this.utilisateurs[this.editingIndex] = { ...this.utilisateur };
        this.cancelEdit();
      } else {
        // Mode ajout
        this.utilisateur.id = this.utilisateurs.length + 1;
        this.utilisateurs.push({ ...this.utilisateur });
        this.resetForm();
      }
    }
  }

  editUtilisateur(utilisateur: any) {
    this.utilisateur = { ...utilisateur };
    this.isEditing = true;
    this.editingIndex = this.utilisateurs.findIndex(u => u.id === utilisateur.id);
  }

  supprimerUtilisateur(id: number) {
    this.utilisateurs = this.utilisateurs.filter(u => u.id !== id);
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingIndex = null;
    this.resetForm();
  }

  private resetForm() {
    this.utilisateur = {
      id: 0,
      nom: '',
      prenom: '',
      email: '',
      pays: '',
      ville: '',
      codePostale: '',
      telephone: '',
      compagnie: ''
    };
  }
}
