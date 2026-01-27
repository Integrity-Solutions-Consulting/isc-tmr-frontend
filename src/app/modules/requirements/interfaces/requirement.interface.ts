export interface EmployeeCategoryResponseDTO {
  EmployeeCategoryID: number;
  name: string;
}

export interface CareerResponseDTO {
  Id: number;
  CareerName: string;
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
  templateName: string;
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

export interface VacancyResponseDTO  {
  id: number;
  name: string;
}

export interface StudyStatuResponseDTO {
  educationStatusID: number;
  educationstatus_name: string;
}
