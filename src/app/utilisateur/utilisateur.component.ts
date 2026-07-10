import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtitlisateurService } from '../services/utilisateur/utitlisateur.service';
import { Utilisateur } from "../model/Utilisateur";

@Component({
  selector: 'app-utilisateur',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.css'
})
export class UtilisateurComponent implements OnInit {
  auth = inject(AuthService);
  router = inject<any>(Router);
  signUpForm!: FormGroup;
  submitted = false;
  utilisateur: Utilisateur = new Utilisateur();


  utilisateurs: any[] = [];
  newUtilisateur = false;
  pageSize = 10;
  currentPage = 1;
  isEditing = false;
  editingIndex: number | null = null;

  constructor(private utilisateurService: UtitlisateurService, private fb: FormBuilder) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.chargerUtilisateurs();
        this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.pattern('')
        //Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  // Custom Validator to match passwords
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  get f() { return this.signUpForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.signUpForm.invalid) return;
    console.log('Form Submitted', this.signUpForm.value);
  }

  private normalizeUserFromApi(user: any): any {
    return {
      ...user,
      codePostale: user?.codePostale ?? user?.codePostal ?? ''
    };
  }

  private toApiPayload(user: any): any {
    return {
      ...user
    };
  }

  chargerUtilisateurs(): void {
    this.utilisateurService.getUtilisateurs().subscribe({
      next: (data) => {
        this.utilisateurs = (data || []).map((u: any) => this.normalizeUserFromApi(u));
        this.currentPage = 1;
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
      this.utilisateurService.updateUtilisateur(this.utilisateur).subscribe({
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

    this.utilisateurService.addUtilisateur(this.utilisateur).subscribe({
      next: (reponse) => {
        this.utilisateurs.push(this.normalizeUserFromApi(reponse));
        this.currentPage = this.totalPages;
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
    this.newUtilisateur = true;
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
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      },
      error: (erreur) => {
        console.error('Erreur lors de la suppression de l\'utilisateur :', erreur);
      }
    });
  }

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
      codePostal: '',
      telephone: '',
      compagnie: ''
    });
    this.newUtilisateur = false;
  }

  private resetForm() {
    this.utilisateur = new Utilisateur();
    this.newUtilisateur = false;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.utilisateurs.length / this.pageSize));
  }

  get paginatedUtilisateurs(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.utilisateurs.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1) {
      this.currentPage = 1;
      return;
    }

    if (page > this.totalPages) {
      this.currentPage = this.totalPages;
      return;
    }

    this.currentPage = page;
  }
}
