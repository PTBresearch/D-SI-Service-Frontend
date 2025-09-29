import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {Contribution} from "../model/contribution.model";

import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Report} from "../model/report.model";

import {Dcc} from "../model/Dcc.model";


@Injectable({
  providedIn: 'root'
})
export class ContributionsService {
  private apiServerUrl = environment.apiBaseUrl;

  private apiServerDCCUrl = environment.apiDCCUrl;

  constructor(private http: HttpClient) {
  }

  public getContributions(): Observable<Contribution[]> {
    return this.http.get<Contribution[]>(`${this.apiServerUrl}/client/contributions`);
  }

  public addContribution(contribution: Contribution): Observable<Contribution> {
    return this.http.post<Contribution>(`${this.apiServerUrl}/client/addContribution`, contribution);
  }

  public onDeleteContribution(contribution: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/client/delete/${contribution}`);
  }

  public onDeleteAll(): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/client/deleteAll`);
  }

  public getReports(): Observable<Report> {
    return this.http.get<Report>(`${this.apiServerUrl}/client/report`);
  }

  public getPidReport(): Observable<string> {
    return this.http.get<string>(`${this.apiServerUrl}/client/report/{pidReport}`);
  }

  public addReport(report: Report): Observable<Report> {
    return this.http.post<Report>(`${this.apiServerUrl}/client/addReport`, report);

  }

  public download(): Observable<any> {
      return this.http.get(`${this.apiServerUrl}/client/download`, {
      observe: 'response', responseType: 'blob'
    });
  }

  public getDccList(): Observable<Dcc[]> {
    return this.http.get<Dcc[]>(`${this.apiServerDCCUrl}/d-dcc/dccPidList`);
    // return this.http.get<Dcc[]>(`${this.apiServerUrl}/d-dcc/dccPidList`);
  }
  public  getAll(): Observable< Dcc[] > {
    return this.http.get< Dcc[] >(`${this.apiServerDCCUrl}/d-dcc/dccList`);
  }

  public uploadDcc(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiServerDCCUrl}/d-dcc/upload`, formData);
  }

  public deleteDcc(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerDCCUrl}/d-dcc/delete/${id}`);
  }

}
