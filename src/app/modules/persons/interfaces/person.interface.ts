//GetPersonRequest
export interface Person {
  GenderID?: number;
  NationalityID?: number;
  IdentificationTypeid?: number;
  identification_number: string;
  person_type: 'NATURAL' | 'JURIDICA';
  first_name: string;
  last_name: string;
  birth_date?: Date;
  email?: string;
  phone?: string;
  address?: string;
}

//Despues del cambio
export interface GetPersonResponse {
  id: number;
  genderID?: number;
  nationalityID?: number;
  identificationTypeID?: number;
  identificationNumber: string;
  personType: 'NATURAL' | 'JURIDICA';
  firstName: string;
  lastName: string;
  birthDate?: Date;
  email?: string;
  phone?: string;
  address?: string;
  status: boolean;
}
