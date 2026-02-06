import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CareerResponseDTO,
  ContactRequestDTO,
  ContactResponseDTO,
  EmployeeCategoryRequirementRequestDTO,
  EmployeeCategoryRequirementResponseDTO,
  EmployeeCategoryResponseDTO,
  KnowledgeResponseDTO,
  ProfileDetailRequestDTO,
  ProfileDetailResponseDTO,
  RequirementRequestDTO,
  RequirementResponseDTO,
  StudyStatuResponseDTO,
  TemplateDetailResponseDTO,
  TemplateResponseDTO,
  ToolResponseDTO,
  VacancyResponseDTO,
  WorkCityResponseDTO,
  WorkModeResponseDTO,
} from '../interfaces/requirement.interface';

@Injectable({
  providedIn: 'root',
})
export class ResourceServiceService {
  urlBase: string = environment.URL_BASE;
  urlBDE: string = environment.URL_BDE;

  constructor(private http: HttpClient) {}

  getEmployeeCategory(): Observable<EmployeeCategoryResponseDTO[]> {
    return this.http.get<EmployeeCategoryResponseDTO[]>(
      `${this.urlBase}/api/Catalog/employee-category`,
    );
  }

  postEmployeeCategoryRequirement(
    request: EmployeeCategoryRequirementRequestDTO[],
  ): Observable<EmployeeCategoryRequirementResponseDTO[]> {
    return this.http.post<EmployeeCategoryRequirementResponseDTO[]>(
      `${this.urlBDE}/api/EmployeeCategoryRequirement/employee-category-requirement`,
      request,
    );
  }

  postProfileDetail(
    request: ProfileDetailRequestDTO,
  ): Observable<ProfileDetailResponseDTO> {
    return this.http.post<ProfileDetailResponseDTO>(
      `${this.urlBase}/api/Requirements/profile-detail`,
      request,
    );
  }

  getAllTemplates(): Observable<TemplateResponseDTO[]> {
    return this.http.get<TemplateResponseDTO[]>(
      `${this.urlBDE}/api/Template/get-all-template`,
    );
  }

  getTemplateById(templateID: number): Observable<TemplateDetailResponseDTO> {
    const params = new HttpParams().set('id', templateID);
    return this.http.get<TemplateDetailResponseDTO>(
      `${this.urlBDE}/api/Template/get-template-detail-by-id`,
      { params },
    );
  }

  postTemplate(
    name: string,
    knowledgeIds: number[],
    toolIds: number[],
  ): Observable<{ TemplateID: number; message: string }> {
    const body = { templateName: name, knowledgeIds, toolIds };

    return this.http.post<{ TemplateID: number; message: string }>(
      `${this.urlBDE}/api/Template/create-template`,
      body,
    );
  }

  postOtherKnowledge(request: any): Observable<any> {
    return this.http.post<any>(
      `${this.urlBase}/api/Requirements/other-knowledge`,
      request,
    );
  }

  getVacancies(): Observable<VacancyResponseDTO[]> {
    return this.http.get<VacancyResponseDTO[]>(
      `${this.urlBDE}/api/Catalog/get-all-vacancies?isActive=true`,
    );
  }

  getContactsByClient(clientId: number): Observable<ContactResponseDTO> {
    return this.http.get<ContactResponseDTO>(
      `${this.urlBDE}/api/Contact/get-contact-by-client?clientId=${clientId}`,
    );
  }

  createContact(request: ContactRequestDTO): Observable<ContactResponseDTO> {
    return this.http.post<ContactResponseDTO>(
      `${this.urlBDE}/api/Contact/create-contact`,
      request,
    );
  }

  getWorkMode(): Observable<WorkModeResponseDTO[]> {
    return this.http.get<WorkModeResponseDTO[]>(
      `${this.urlBase}/api/Catalog/work-mode`,
    );
  }

  getWorkCity(): Observable<WorkCityResponseDTO[]> {
    return this.http.get<WorkCityResponseDTO[]>(
      `${this.urlBDE}/api/Catalog/get-all-work-city`,
    );
  }

  GetAllStudyStatus(): Observable<StudyStatuResponseDTO[]> {
    return this.http.get<StudyStatuResponseDTO[]>(
      `${this.urlBDE}/api/Catalog/get-all-study-status`,
    );
  }

  GetAllCareers(isActive: boolean): Observable<CareerResponseDTO[]> {
    const params = new HttpParams().set('isActive', isActive);
    return this.http.get<CareerResponseDTO[]>(
      `${this.urlBDE}/api/Catalog/get-all-careers`,
      { params },
    );
  }

  GetAllTools(
    isActive: boolean = true,
    search?: string,
  ): Observable<ToolResponseDTO[]> {
    let params = new HttpParams().set('isActive', isActive);
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<ToolResponseDTO[]>(
      `${this.urlBDE}/api/Catalog/get-all-tools`,
      { params },
    );
  }

  GetAllKnowledge(
    isActive: boolean = true,
    search?: string,
  ): Observable<KnowledgeResponseDTO[]> {
    let query = `?isActive=${isActive}`;
    if (search) query += `&search=${search}`;

    return this.http.get<KnowledgeResponseDTO[]>(
      `${this.urlBDE}/api/Catalog/get-all-knowledges${query}`,
    );
  }

  PostRequirement(
    request: RequirementRequestDTO,
  ): Observable<RequirementResponseDTO> {
    return this.http.post<RequirementResponseDTO>(
      `${this.urlBDE}/api/Requirement/create-requirement`,
      request,
    );
  }
}
