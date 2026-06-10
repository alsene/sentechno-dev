import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private contacts = [
    { id: 1, nom: 'Sene', prenom: 'Alassane', email: 'alassane.sene@email.com', tel: '771234567' },
    { id: 2, nom: 'Faye', prenom: 'Cheikh', email: 'cheikh.fayep@email.com', tel: '770987654' },
    { id: 3, nom: 'Diouf', prenom: 'Pape Semou', email: 'semou.diouf@email.com', tel: '778765432' },
    { id: 4, nom: 'Diop', prenom: 'Cheikh Mbacké', email: 'cheikh.diop@email.com', tel: '770987654' },
    { id: 5, nom: 'Kebe', prenom: 'Lamine', email: 'lamine.kebe@email.com', tel: '778765432' }
  ];

  constructor() { }

  getContacts() {
    return this.contacts;
  }

  addContact(contact: any) {
    // Générer un nouvel id unique
    const newId = this.contacts.length > 0 ? Math.max(...this.contacts.map(c => c.id)) + 1 : 1;
    this.contacts.push({ ...contact, id: newId });
  }

  updateContact(updatedContact: any) {
    const index = this.contacts.findIndex(c => c.id === updatedContact.id);
    if (index !== -1) {
      this.contacts[index] = { ...updatedContact };
    }
  }

  deleteContact(id: number) {
    this.contacts = this.contacts.filter(c => c.id !== id);
  }
}
