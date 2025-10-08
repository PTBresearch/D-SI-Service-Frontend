import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {Contribution} from "../model/contribution.model";

import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Report} from "../model/report.model";

import {Dcc} from "../model/Dcc.model";
import {User} from "../model/User.model";
import {TimestampVerificationResult} from "../model/timestampVerificationResult.model";


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

  // public getDccList(): Observable<Dcc[]> {
  //   return this.http.get<Dcc[]>(`${this.apiServerDCCUrl}/d-dcc/dccPidList`);
  //   // return this.http.get<Dcc[]>(`${this.apiServerUrl}/d-dcc/dccPidList`);
  // }
  public getAllDccPidList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerDCCUrl}/d-dcc/listAllDccPid`);
    // return this.http.get<Dcc[]>(`${this.apiServerUrl}/d-dcc/dccPidList`);
  }
  public getOwnAndPublicDccList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerDCCUrl}/d-dcc/coordinatorListPidAndPublic`);
    // return this.http.get<Dcc[]>(`${this.apiServerUrl}/d-dcc/dccPidList`);
  }
  public getPublicDccList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerDCCUrl}/d-dcc/dccPublicPidList`);
    // return this.http.get<Dcc[]>(`${this.apiServerUrl}/d-dcc/dccPidList`);
  }
  // public  getAll(): Observable< Dcc[] > {
  //   return this.http.get< Dcc[] >(`${this.apiServerDCCUrl}/d-dcc/dccList`);
  // }
  public getPublicCoordinatorDccList(): Observable<Dcc[]> {
    return this.http.get<Dcc[]>(`${this.apiServerDCCUrl}/d-dcc/publicAndCoordinatorDccList`);
  }
  getAllDccList(): Observable<Dcc[]> {
    return this.http.get<Dcc[]>(`${this.apiServerDCCUrl}/d-dcc/allDccList`);
  }
  public uploadDcc(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiServerDCCUrl}/d-dcc/upload`, formData);
  }
  public onViewXml(pid: string): Observable<any> {
    return this.http.get(`${this.apiServerDCCUrl}/d-dcc/downloadXml?pid=${encodeURIComponent(pid)}`, {
      observe: 'response',
      responseType: 'blob'
    });
  }
  verifyTimestamp(pid: string): Observable<string> {
    const params = new HttpParams().set('pid', pid);
    return this.http.post(`${this.apiServerDCCUrl}/d-dcc/verify`, null, {
      params,
      responseType: 'text'
    });
  }
  verifyTsr(pid: string): Observable<TimestampVerificationResult> {
    const url = `${this.apiServerDCCUrl}/d-dcc/verify?pid=${encodeURIComponent(pid)}`;
    return this.http.post<TimestampVerificationResult>(url, null); // null, weil POST ohne Body
  }
  public deleteDccByPid(pid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerDCCUrl}/d-dcc/deleteByPid/${pid}`);
  }
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServerDCCUrl}/d-dcc/users`, { withCredentials: true });
  }
}
