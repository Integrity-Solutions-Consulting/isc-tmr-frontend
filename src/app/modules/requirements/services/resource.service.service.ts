import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeCategoryRequirementRequestDTO, EmployeeCategoryRequirementResponseDTO, EmployeeCategoryResponseDTO, ProfileDetailRequestDTO, ProfileDetailResponseDTO } from '../interfaces/requirement.interface';

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

  getTemplate(): Observable<any> {
    return this.http.get<any>(
      `${this.urlBase}/api/Requirements/templates`);
  }

  postTemplate(request: any): Observable<any> {
    return this.http.post<any>(
      `${this.urlBase}/api/Requirements/templates`, request)
  }

  postOtherKnowledge(request: any): Observable<any> {
    return this.http.post<any>(
      `${this.urlBase}/api/Requirements/other-knowledge`, request)
  }

  getVacancies(): Observable<any> {
    return this.http.get<any>(
      `${this.URL_BDE}/api/Vacancy/get-all-vacancies`);
  }

}
