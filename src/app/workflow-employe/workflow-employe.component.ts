import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WorkflowEmployeData,
  EmployerData,
  AdresseData,
  InformationData,
  FormationData,
  EmployeurData
} from './workflow-employe.model';
import { EmployerComponent } from './employer/employer.component';
import { AdresseComponent } from './adresse/adresse.component';
import { InformationComponent } from './information/information.component';
import { FormationComponent } from './formation/formation.component';
import { EmployeurComponent } from './employeur/employeur.component';

interface WorkflowStep {
  key: string;
  label: string;
  hint: string;
}

@Component({
  selector: 'app-workflow-employe',
  standalone: true,
  imports: [
    CommonModule,
    EmployerComponent,
    AdresseComponent,
    InformationComponent,
    FormationComponent,
    EmployeurComponent
  ],
  templateUrl: './workflow-employe.component.html',
  styleUrl: './workflow-employe.component.css'
})
export class WorkflowEmployeComponent {
  readonly breadcrumbItems = ['Identite', 'Adresse', 'Statut et piece', 'Formation', 'Employeur','Fin'];

  readonly steps: WorkflowStep[] = [
    { key: 'employer', label: 'Identite', hint: 'Renseigner les informations personnelles de base.' },
    { key: 'adresse', label: 'Adresse', hint: 'Completer les coordonnees de residence.' },
    { key: 'information', label: 'Statut et piece', hint: 'Selectionner les statuts et pieces administratives.' },
    { key: 'formation', label: 'Formation', hint: 'Ajouter le CV, les etudes et diplomes.' },
    { key: 'employeur', label: 'Employeur', hint: 'Renseigner les informations de l employeur actuel.' },
    { key: 'fin', label: 'Fin', hint: 'Verifier toutes les informations avant validation finale.' }
  ];

  currentStep = 0;
  submitted = false;
  payload: WorkflowEmployeData = this.createInitialPayload();

  nextStep(): void {
    if (!this.isCurrentStepValid()) {
      return;
    }

    if (this.currentStep < this.steps.length - 1) {
      this.currentStep += 1;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep -= 1;
    }
  }

  submit(): void {
    if (!this.isCurrentStep('fin') || !this.isCurrentStepValid()) {
      return;
    }

    this.submitted = true;
  }

  reset(): void {
    this.payload = this.createInitialPayload();
    this.currentStep = 0;
    this.submitted = false;
  }

  isCurrentStep(stepKey: string): boolean {
    return this.steps[this.currentStep].key === stepKey;
  }

  goToStep(index: number): void {
    if (index < 0 || index >= this.steps.length || !this.isStepAccessible(index)) {
      return;
    }

    this.currentStep = index;
  }

  get currentStepMeta(): WorkflowStep {
    return this.steps[this.currentStep];
  }

  get completionPercent(): number {
    return Math.round(((this.currentStep + 1) / this.steps.length) * 100);
  }

  isStepCompleted(index: number): boolean {
    return index < this.currentStep;
  }

  isStepAccessible(index: number): boolean {
    if (index < this.steps.length - 1) {
      return true;
    }

    return this.areMainStepsValid();
  }

  isCurrentStepValid(): boolean {
    const stepKey = this.steps[this.currentStep].key;

    switch (stepKey) {
      case 'employer':
        return this.isEmployerValid(this.payload.employer);
      case 'adresse':
        return this.isAdresseValid(this.payload.adresse);
      case 'information':
        return this.isInformationValid(this.payload.information);
      case 'formation':
        return this.isFormationValid(this.payload.formation);
      case 'employeur':
        return this.isEmployeurValid(this.payload.employeur);
      case 'fin':
        return this.areMainStepsValid();
      default:
        return false;
    }
  }

  private areMainStepsValid(): boolean {
    return (
      this.isEmployerValid(this.payload.employer) &&
      this.isAdresseValid(this.payload.adresse) &&
      this.isInformationValid(this.payload.information) &&
      this.isFormationValid(this.payload.formation) &&
      this.isEmployeurValid(this.payload.employeur)
    );
  }

  private isEmployerValid(data: EmployerData): boolean {
    return !!data.nom && !!data.prenom && !!data.dateNaissance && !!data.telephone;
  }

  private isAdresseValid(data: AdresseData): boolean {
    return !!data.rue && !!data.ville && !!data.codePostale && !!data.pays && !!data.province;
  }

  private isInformationValid(data: InformationData): boolean {
    const hasStatus = Object.values(data.status).some((value) => value);
    const hasPiece = Object.values(data.piece).some((value) => value);
    return hasStatus && hasPiece;
  }

  private isFormationValid(data: FormationData): boolean {
    const hasEtude = Object.values(data.etude).some((value) => value);
    const hasDiplome = Object.values(data.diplome).some((value) => value);
    return !!data.cv && hasEtude && hasDiplome;
  }

  private isEmployeurValid(data: EmployeurData): boolean {
    return !!data.nom && !!data.adresse && !!data.telephone;
  }

  private createInitialPayload(): WorkflowEmployeData {
    return {
      employer: {
        nom: '',
        prenom: '',
        dateNaissance: '',
        telephone: ''
      },
      adresse: {
        rue: '',
        ville: '',
        codePostale: '',
        pays: '',
        province: ''
      },
      information: {
        status: {
          residant: false,
          etudiant: false,
          visiteur: false,
          travailleur: false,
          citoyen: false
        },
        piece: {
          passport: false,
          carteResident: false,
          permisTravaille: false
        }
      },
      formation: {
        cv: '',
        etude: {
          secondaire: false,
          cgep: false,
          universitaire: false
        },
        diplome: {
          bac: false,
          dess: false
        }
      },
      employeur: {
        nom: '',
        adresse: '',
        telephone: ''
      }
    };
  }
}

