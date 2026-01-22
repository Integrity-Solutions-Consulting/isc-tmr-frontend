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
  template_name: string;
}

export interface TemplateRequestDTO {
  TemplateID: number;
  template_name: string;

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
