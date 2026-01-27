export interface EmployeeCategoryResponseDTO {
  EmployeeCategoryID: number;
  name: string;
}

export interface CareerResponseDTO {
  CareerID: number;
  career_name: string;
}

export interface StudyStatusResponseDTO {
  StudyStatusID: number;
  study_status_name: string;
}

export interface EmployeeCategoryRequirementResponseDTO {
  EmployeeCategoryRequirementID: number;
  EmployeeCategoryID: number;
  RequirementID: number;
  quantity: number;
}

export interface EmployeeCategoryRequirementRequestDTO {
  EmployeeCategoryID: number;
  RequirementID: number;
  quantity: number;
}

export interface ProfileDetailResponseDTO {
  experience: number;
  StudyStatusID: StudyStatusResponseDTO[];
  CareerID: CareerResponseDTO[];
}

export interface ProfileDetailRequestDTO {
  ProfileDetailResponseID: number;
  experience: number;
  StudyStatusID: StudyStatusResponseDTO[];
  CareerID: CareerResponseDTO[];
}

export interface TemplateResponseDTO {
  templateID: number;
}

export interface TemplateDetailResponseDTO {
  templateDetailID: number;
  templateName: string;
  knowledgeIDs: number[];
  toolIDs: number[];
}

export interface TemplateRequestDTO {
  templateName: string;
  knowledgeIds: number[];
  toolIds: number[];
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

export interface VacancyResponseDTO  {
  id: number;
  name: string;
}

export interface StudyStatuResponseDTO {
  educationStatusID: number;
  educationstatus_name: string;
}
