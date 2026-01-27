import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CareerResponseDTO, EmployeeCategoryRequirementRequestDTO, EmployeeCategoryRequirementResponseDTO, EmployeeCategoryResponseDTO, ProfileDetailRequestDTO, ProfileDetailResponseDTO, StudyStatuResponseDTO, TemplateDetailResponseDTO, TemplateResponseDTO } from '../interfaces/requirement.interface';

@Injectable({
  providedIn: 'root'
})
export class ResourceServiceService {
  urlBase: string = environment.URL_BASE;
  URL_BDE: string = environment.URL_BDE;

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
      `${this.URL_BDE}/api/Template/get-all-template`);
  }

  getTemplateById(templateID: number): Observable<TemplateDetailResponseDTO> {
    return this.http.get<TemplateDetailResponseDTO>(
      `${this.URL_BDE}/api/Template/get-template-by-id/${templateID}`);
  }

  postTemplate(name: string, knowledgeIds: number[], toolIds: number[]): Observable<number> {
    const body = {templateName: name, knowledgeIds: knowledgeIds, toolIds: toolIds};
    return this.http.post<number>(
      `${this.URL_BDE}/api/Template/create-template`, body)
  }

  postOtherKnowledge(request: any): Observable<any> {
    return this.http.post<any>(
      `${this.urlBase}/api/Requirements/other-knowledge`, request)
  }

  getVacancies(): Observable<any> {
    return this.http.get<any>(
      `${this.URL_BDE}/api/Vacancy/get-all-vacancies`);
  }

  getContactsByClient(clientId: number): Observable<any> {
    return this.http.get<any>(
      `${this.urlBase}/api/Clients/${clientId}/contacts`);
  }

  getServiceModalities(): Observable<any> {
    return this.http.get<any>(
      `${this.urlBase}/api/Catalogs/service-modality`);
  }

  getCities(): Observable<any> {
    return this.http.get<any>(
      `${this.urlBase}/api/Catalogs/cities`);
  }

  GetAllStudyStatus(): Observable<StudyStatuResponseDTO[]>{
    return this.http.get<StudyStatuResponseDTO[]>(
      `${this.URL_BDE}/Catalog/get-all-study-status`
    )
  }

  GetAllCareers(isActive: boolean): Observable<CareerResponseDTO[]>{
    const params = new HttpParams().set('isActive', isActive);
    return this.http.get<CareerResponseDTO[]>(
      `${this.URL_BDE}/api/Catalogs/get-all-careers`, {params}
    )
  }

}
