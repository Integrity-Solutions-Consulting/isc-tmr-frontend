export interface RequirementRequestDTO {
  contactId: number;
  workModeId: number;
  careerId: number;
  vacancyId: number;
  workCityId: number;
  templateId?: number;
  educationStatusId: number;
  contractPeriod: string;
  budget: number;
  workingHours: number;
  yearsExperience: number;
  otherCertification: string;
  otherKnowledge: string;
  additionalComments: string;
}

export interface RequirementResponseDTO {
  requirementID: number;
  message: string;
}

export interface CareerResponseDTO {
  Id: number;
  CareerName: string;
}

export interface ContactResponseDTO {
  ContactID: number;
  ClientID: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ContactRequestDTO {
  ClientID: number;
  ContactName: string;
  ContactLastName: string;
  ContactEmail: string;
}

export interface EmployeeCategoryResponseDTO {
  id: number;
  categoryName: string;
}

export interface EmployeeCategoryRequirementResponseDTO {
  EmployeeCategoryRequirementID: number;
}

export interface EmployeeCategoryRequirementRequestDTO {
  EmployeeCategoryId: number;
  RequirementId: number;
  Quantity: number;
}

export interface ProfileDetailResponseDTO {
  experience: number;
  StudyStatusID: StudyStatuResponseDTO[];
  CareerID: CareerResponseDTO[];
}

export interface ProfileDetailRequestDTO {
  ProfileDetailResponseID: number;
  experience: number;
  StudyStatusID: StudyStatuResponseDTO[];
  CareerID: CareerResponseDTO[];
}

export interface TemplateResponseDTO {
  templateID: number;
  template_name: string;
}
export interface CreateTemplateResponseDTO {
  TemplateID: number;
  message: string;
}

export interface TemplateDetailResponseDTO {
  id: number;
  name: string;
  knowledges: {
    id: number;
    knowledgeName: string;
  }[];
  tools: {
    id: number;
    toolName: string;
  }[];
}

export interface TemplateRequestDTO {
  templateName: string;
  knowledgeIds: number[];
  toolIds: number[];
}

export interface ToolResponseDTO {
  toolID: number;
  toolName: string;
}

export interface KnowledgeResponseDTO {
  knowledgeID: number;
  knowledgeName: string;
}

export interface OtherKnowledgeResponseDTO {
  other_knowledge: string;
  certificate_data: string;
  other_comments: string;
}

export interface OtherKnowledgeRequestDTO {
  OtherKnowledgeID: number;
  other_knowledge: string;
  certificate_data: string;
  other_comments: string;
}

export interface ClientResponseDTO {
  id: number;
  legalName: string;
}

export interface VacancyResponseDTO {
  id: number;
  vacancyTitle: string;
}

export interface StudyStatuResponseDTO {
  educationStatusID: number;
  educationstatus_name: string;
}

export interface WorkCityResponseDTO {
  WorkCityID: number;
  cityNaworkcity_name: string;
}

export interface WorkModeResponseDTO {
  Id: number;
  Name: string;
}
