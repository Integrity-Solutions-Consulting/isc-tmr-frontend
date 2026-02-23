import { GetPersonResponse } from "../../persons/interfaces/person.interface";
import { Project } from "../../projects/interfaces/project.interface";

//Leader Utilizado para mostrar la información de los líderes en la vista de líderes
export interface Leader {
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  LeadershipType: boolean;
}

export interface CreateLeaderRequest {
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  LeadershipType: boolean;
}

export interface CreateLeaderResponse {
  Id: number;
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  LeadershipType: boolean;
}

export interface UpdateLeaderRequest {
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  LeadershipType: boolean;
}

export interface UpdateLeaderResponse {
  Id: number;
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  LeadershipType: boolean;
}

export interface GetLeaderDetailsResponse {
  FirstName : string;
  LastName : string;
  Phone : string;
  Email : string;
  LeadershipType : boolean;
  Status: boolean;
}

export interface ActivateInactivateLeaderResponse {
  Id: number;
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  LeadershipType: boolean;
}

export interface AssignLeaderToProjectRequest {
  LeaderID: number;
  ProjectID: number;
}

export interface AssignLeaderToProjectResponse {
  LeaderID: number;
  ProjectID: number;
  Message: string;
}

export interface GetAllLeaderProjectByPersonIdResponse {
  Person?: GetPersonResponse;
  LeaderMiddle: LeaderData[];
}

export interface LeaderData {
  Id: number;
  Responsability: string;
  StartDate: string;
  EndDate?: string;
  LeadershipType: boolean;
  Status: boolean;
  Projectos?: Project;
}

/*export interface LeaderWithPerson {
  projectID: number;
  leadershipType: boolean;
  startDate: Date | null;
  endDate: Date | null;
  responsibilities: string;
  status: boolean;
  person: {
    genderId: number;
    nationalityId: number;
    identificationTypeId: number;
    identificationNumber: string;
    personType: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    email: string;
    phone: string;
    address: string;
  }
}

export interface LeaderWithIDandPerson{
  id: number;
  projectID: number;
  leadershipType: boolean;
  startDate: Date;
  endDate: Date;
  responsibilities: string;
  status: boolean;
  person: {
    id: number;
    genderID: number;
    nationalityId: number;
    identificationTypeId: number;
    identificationNumber: string;
    personType: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    email: string;
    phone: string;
    address: string;
  }
}*/

/*export interface LeaderWithPersonID {
  personID: number;
  projectID: number;
  leadershipType: boolean;
  startDate: Date;
  endDate: Date;
  responsibilities: string;
  status: boolean;

}*/



export interface Person {
  id: number;
  genderID: number;
  nationalityId: number;
  identificationTypeId: number;
  identificationNumber: string;
  personType: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  phone: string;
  address: string;
}

/*export interface ApiResponse {
  items: LeaderWithIDandPerson[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}*/

export interface PersonApiResponse {
  items: Person[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

/*export interface LeaderAssignmentPayload {
  personID: number;
  personProjectMiddle: PersonProjectMiddle[];
}*/


export interface PersonProjectMiddle {
  projectID: number;
  leadershipType: boolean;
  startDate: string;
  endDate?: string;
  responsibilities?: string;
  status: boolean;
}

export interface LeaderAssignment {
  id: number;
  responsibility: string;
  startDate: string;
  endDate: string;
  leadershipType: boolean;
  status: boolean;
  projectos: any;
  projectId?: number;
  projectName?: string;
}

export interface LeaderGroup {
  person: {
    id: number;
    genderId: number;
    nationalityId: number;
    identificationTypeId: number;
    identificationNumber: string;
    personType: any;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    email: string;
    phone: string;
    address: string;
    status: boolean;
  };
  leaderMiddle: LeaderAssignment[];
}

/*export interface Project {
  id: number;
  clientID: number;
  projectStatusID: number;
  projectTypeID: number;
  code: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  actualStartDate: string | null;
  actualEndDate: string | null;
  budget: number;
  hours: number;
  status: boolean;
}*/

export interface UniqueLeader {
  id: number;
  person: Person;
  projects: number[]; // IDs de proyectos a los que está asignado
  leadershipType: boolean;
  status: boolean;
}
