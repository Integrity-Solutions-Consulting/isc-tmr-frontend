import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CareerResponseDTO, EmployeeCategoryRequirementRequestDTO, EmployeeCategoryRequirementResponseDTO, EmployeeCategoryResponseDTO, KnowledgeResponseDTO, ProfileDetailRequestDTO, ProfileDetailResponseDTO, StudyStatuResponseDTO, TemplateDetailResponseDTO, TemplateResponseDTO, ToolResponseDTO, WorkCityResponseDTO, WorkModeResponseDTO } from '../interfaces/requirement.interface';

@Injectable({
  providedIn: 'root'
})
export class ResourceServiceService {
  urlBase: string = environment.URL_BASE;
  urlBDE: string = environment.URL_BDE;

  constructor(private http: HttpClient) { }

  getEmployeeCategory(): Observable<EmployeeCategoryResponseDTO[]> {
    return this.http.get<EmployeeCategoryResponseDTO[]>(
      `${this.urlBase}/api/Catalogs/employee-category`);
  }

  postEmployeeCategoryRequirement(request: EmployeeCategoryRequirementRequestDTO): Observable<EmployeeCategoryRequirementResponseDTO> {
    return this.http.post<EmployeeCategoryRequirementResponseDTO>(
      `${this.urlBase}/api/Requirements/employee-category-requirement`, request)
  }

  postProfileDetail(request: ProfileDetailRequestDTO): Observable<ProfileDetailResponseDTO> {
    return this.http.post<ProfileDetailResponseDTO>(
      `${this.urlBase}/api/Requirements/profile-detail`, request)
  }

  getAllTemplates(): Observable<TemplateResponseDTO[]> {
    return this.http.get<TemplateResponseDTO[]>(
      `${this.urlBDE}/api/Template/get-all-template`);
  }

  getTemplateById(templateID: number): Observable<TemplateDetailResponseDTO> {
    const params = new HttpParams().set('id', templateID);
    return this.http.get<TemplateDetailResponseDTO>(
      `${this.urlBDE}/api/Template/get-template-by-id`, { params });
  }

  postTemplate(name: string, knowledgeIds: number[], toolIds: number[]): Observable<number> {
    const body = {templateName: name, knowledgeIds: knowledgeIds, toolIds: toolIds};
    return this.http.post<number>(
      `${this.urlBDE}/api/Template/create-template`, body)
  }

  postOtherKnowledge(request: any): Observable<any> {
    return this.http.post<any>(
      `${this.urlBase}/api/Requirements/other-knowledge`, request)
  }

  getVacancies(): Observable<any> {
    return this.http.get<any>(
      `${this.urlBDE}/api/Catalog/get-all-vacancies?isActive=true`);
  }

  getContactsByClient(clientId: number): Observable<any> {
    return this.http.get<any>(
      `${this.urlBase}/api/Clients/${clientId}/contacts`);
  }

  getWorkMode(): Observable<WorkModeResponseDTO[]> {
    return this.http.get<WorkModeResponseDTO[]>(
      `${this.urlBase}/api/Catalog/work-mode`);
  }

  getWorkCity(): Observable<WorkCityResponseDTO[]> {
    return this.http.get<WorkCityResponseDTO[]>(
       `${this.urlBDE}/api/Catalog/get-all-work-city`);
  }

  GetAllStudyStatus(): Observable<StudyStatuResponseDTO[]>{
    return this.http.get<StudyStatuResponseDTO[]>(
      `${this.urlBDE}/api/Catalog/get-all-study-status`
    )
  }

  GetAllCareers(isActive: boolean): Observable<CareerResponseDTO[]>{
    const params = new HttpParams().set('isActive', isActive);
    return this.http.get<CareerResponseDTO[]>(
      `${this.urlBDE}/api/Catalog/get-all-careers`, {params}
    )
  }

  GetAllTools(isActive: boolean = true, search?: string): Observable<ToolResponseDTO[]>{
    let params = new HttpParams().set('isActive', isActive);
    if (search){
      params = params.set('search', search);
    }
    return this.http.get<ToolResponseDTO[]>(
      `${this.urlBDE}/api/Catalog/get-all-tools`,
      {params}
    )
  }

  GetAllKnowledge(isActive: boolean = true, search?: string): Observable<KnowledgeResponseDTO[]> {
    let query = `?isActive=${isActive}`;
    if (search) query += `&search=${search}`;

    return this.http.get<KnowledgeResponseDTO[]>(
      `${this.urlBDE}/api/Catalog/get-all-knowledges${query}`
    );
  }

}
