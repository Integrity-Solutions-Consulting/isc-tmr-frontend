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
  Id: number;
  GenderID?: number;
  NationalityID?: number;
  IdentificationTypeID?: number;
  IdentificationNumber: string;
  PersonType: 'NATURAL' | 'JURIDICA';
  FirstName: string;
  LastName: string;
  BirthDate?: Date;
  Email?: string;
  Phone?: string;
  Address?: string;
  Status: boolean;
}
