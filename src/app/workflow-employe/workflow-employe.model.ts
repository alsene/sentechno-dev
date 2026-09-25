export interface EmployerData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
}

export interface AdresseData {
  rue: string;
  ville: string;
  codePostale: string;
  pays: string;
  province: string;
}

export interface InformationStatus {
  residant: boolean;
  etudiant: boolean;
  visiteur: boolean;
  travailleur: boolean;
  citoyen: boolean;
}

export interface InformationPiece {
  passport: boolean;
  carteResident: boolean;
  permisTravaille: boolean;
}

export interface InformationData {
  status: InformationStatus;
  piece: InformationPiece;
}

export interface FormationEtude {
  secondaire: boolean;
  cgep: boolean;
  universitaire: boolean;
}

export interface FormationDiplome {
  bac: boolean;
  dess: boolean;
}

export interface FormationData {
  cv: string;
  etude: FormationEtude;
  diplome: FormationDiplome;
}

export interface EmployeurData {
  nom: string;
  adresse: string;
  telephone: string;
}

export interface WorkflowEmployeData {
  employer: EmployerData;
  adresse: AdresseData;
  information: InformationData;
  formation: FormationData;
  employeur: EmployeurData;
}

