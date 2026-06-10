import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ContactsService } from '../services/contacts/contacts.service';
import { FormsModule } from '@angular/forms';
import {  CommonModule, NgIf } from '@angular/common';
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})

export class ContactsComponent {
  auth = inject(AuthService);
  router = inject<any>(Router);
  contacts: any[] = [];
  newContact = { nom: '', prenom: '', email: '', tel: '' };
  editingContactId: number | null = null;

  constructor(private contactsService: ContactsService) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.contacts = this.contactsService.getContacts();
  }

  addContact() {
    if (this.editingContactId === null) {
      if (this.newContact.nom && this.newContact.prenom && this.newContact.email && this.newContact.tel) {
        this.contactsService.addContact(this.newContact);
        this.newContact = { nom: '', prenom: '', email: '', tel: '' };
      }
    } else {
      // update
      const updated = { ...this.newContact, id: this.editingContactId };
      this.contactsService.updateContact(updated);
      this.editingContactId = null;
      this.newContact = { nom: '', prenom: '', email: '', tel: '' };
    }
  }

  editContact(contact: any) {
    this.editingContactId = contact.id;
    this.newContact = { nom: contact.nom, prenom: contact.prenom, email: contact.email, tel: contact.tel };
  }

  deleteContact(id: number) {
    this.contactsService.deleteContact(id);
    // Mettre à jour la liste locale
    this.contacts = this.contactsService.getContacts();
    // Si on supprime le contact en cours d'édition, on annule l'édition
    if (this.editingContactId === id) {
      this.editingContactId = null;
      this.newContact = { nom: '', prenom: '', email: '', tel: '' };
    }
  }

  info:string= '';
  isCourriel:boolean=false
  aucunCourriel="Aucun couriel n'a été envoyé concernant la formation d'angular 2025."
    getStylesBlue() {
      return {
        'padding': '10px',
        'color': 'blue',
        'font-size.px': 20
      };
    }

    getStylesRed() {
      return {
        'padding': '10px',
        'color': 'red',
        'font-size.px': 20
      };
    }

    getStylesInfo() {
      return {
        'background-color': 'lightblue',
        'color': 'darkblue',
        'font-size': '20px',
        'padding': '10px'
      };
    }

  user = {
    name: 'Pape Semou DIOUF',
    tel: 776528001,
    email: 'pape.semou@example.com'
  };

  infoCourriel = {
    courriel: '',
    notif: ''
  };

  sendEmail(): void {
    this.isCourriel=true
    this.infoCourriel.courriel=', Vous avez reçu un email pour la formation angular 2025.'
    this.infoCourriel.notif='INFO: Bonjour'
  }

 clean(): void {
    this.isCourriel=false
  }
}
