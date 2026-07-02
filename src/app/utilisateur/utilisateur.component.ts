import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtitlisateurService } from '../services/utilisateur/utitlisateur.service';

@Component({
  selector: 'app-utilisateur',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.css'
})
export class UtilisateurComponent implements OnInit {
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

  constructor(private utilisateurService: UtitlisateurService) {}

  ngOnInit(): void {
    this.chargerUtilisateurs();
  }

  private normalizeUserFromApi(user: any): any {
    return {
      ...user,
      codePostale: user?.codePostale ?? user?.codePostal ?? ''
    };
  }

  private toApiPayload(user: any): any {
    return {
      ...user,
      codePostal: user?.codePostale ?? user?.codePostal ?? ''
    };
  }

  chargerUtilisateurs(): void {
    this.utilisateurService.getUtilisateurs().subscribe({
      next: (data) => {
        this.utilisateurs = (data || []).map((u: any) => this.normalizeUserFromApi(u));
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des utilisateurs :', erreur);
      }
    });
  }

  ajouterUtilisateur(): void {
    if (!this.utilisateur.nom || !this.utilisateur.prenom || !this.utilisateur.email) {
      return;
    }

    const payload = this.toApiPayload(this.utilisateur);

    if (this.isEditing && this.editingIndex !== null) {
      this.utilisateurService.updateUtilisateur(payload).subscribe({
        next: (reponse) => {
          this.utilisateurs[this.editingIndex!] = this.normalizeUserFromApi(reponse);
          this.cancelEdit();
        },
        error: (erreur) => {
          console.error('Erreur lors de la modification de l\'utilisateur :', erreur);
        }
      });
      return;
    }

    this.utilisateurService.addUtilisateur(payload).subscribe({
      next: (reponse) => {
        this.utilisateurs.push(this.normalizeUserFromApi(reponse));
        this.resetForm();
      },
      error: (erreur) => {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', erreur);
      }
    });
  }

  editUtilisateur(utilisateur: any): void {
    this.utilisateur = this.normalizeUserFromApi({ ...utilisateur });
    this.isEditing = true;
    this.editingIndex = this.utilisateurs.findIndex(u => u.id === utilisateur.id);
  }

  supprimerUtilisateur(id: number): void {
    const utilisateur = this.utilisateurs.find(u => u.id === id);
    if (!utilisateur) {
      return;
    }

    this.utilisateurService.removeUtilisateur(this.toApiPayload(utilisateur)).subscribe({
      next: () => {
        this.utilisateurs = this.utilisateurs.filter(u => u.id !== id);
        if (this.isEditing && this.utilisateur.id === id) {
          this.cancelEdit();
        }
      },
      error: (erreur) => {
        console.error('Erreur lors de la suppression de l\'utilisateur :', erreur);
      }
    });
  }

  /*ajouterUtilisateur() {
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
  }*/

  cancelEdit() {
    this.isEditing = false;
    this.editingIndex = null;
    const resetUser = this.utilisateurService.cancelEditer();
    this.utilisateur = this.normalizeUserFromApi({
      ...resetUser,
      id: 0,
      nom: '',
      prenom: '',
      email: '',
      pays: '',
      ville: '',
      codePostale: '',
      telephone: '',
      compagnie: ''
    });
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
