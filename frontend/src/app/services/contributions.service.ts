import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, throwError} from "rxjs";
import {Contribution} from "../model/contribution.model";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Report} from "../model/report.model";
import {Dcc} from "../model/Dcc.model";
import {User} from "../model/User.model";
import {TimestampVerificationResult} from "../model/timestampVerificationResult.model";
import {Page} from "../model/page.model";



@Injectable({
  providedIn: 'root'
})
export class ContributionsService {
  private apiServerUrl = environment.apiBaseUrl;

  private apiServerDCCUrl = environment.apiDCCUrl;

  constructor(private http: HttpClient) {
  }

  addContribution(contribution: Contribution, sessionId: string): Observable<Contribution> {
    const headers = new HttpHeaders().set('sessionId', sessionId);
    console.log('Sending contribution:', contribution);

    return this.http.post<Contribution>(
      `${this.apiServerUrl}/client/addContribution?sessionId=${sessionId}`,
      contribution,{ headers}
    );
  }

  public getContributions(sessionId: string): Observable<Contribution[]> {
    return this.http.get<Contribution[]>(`${this.apiServerUrl}/client/contributions?sessionId=${sessionId}`, {
      withCredentials: true
    });
  }


  onDeleteContribution(id: number, sessionId: string): Observable<void> {
    const headers = new HttpHeaders().set('sessionId', sessionId);  // Setzt die sessionId im Header
    return this.http.delete<void>(`${this.apiServerUrl}/client/delete/${id}`, { headers });
  }

  public deleteAllContributions(sessionId: string): Observable<void> {
    const headers = new HttpHeaders().set('sessionId', sessionId);  // Setzt den Header korrekt
    return this.http.delete<void>(`${this.apiServerUrl}/client/deleteAll`, {
      headers,
      withCredentials: true
    });
  }

  public getReports(sessionId: string): Observable<Report> {
    const headers = new HttpHeaders().set('sessionId', sessionId);
    return this.http.get<Report>(`${this.apiServerUrl}/client/report`, { headers, withCredentials: true });
  }

  addReport(report: Report, sessionId: string): Observable<Report> {
    const headers = new HttpHeaders().set('sessionId', sessionId);  // Setzt die sessionId im Header
    return this.http.post<Report>(`${this.apiServerUrl}/client/addReport`, report, { headers });
  }
  public getPidReport(): Observable<string> {
    return this.http.get<string>(`${this.apiServerUrl}client/report/{pidReport}`, { withCredentials: true });
  }

  public download(sessionId: string): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders().set('sessionId', sessionId);
    return this.http.get(`${this.apiServerUrl}/client/download`, {
      headers,
      observe: 'response',
      responseType: 'blob',
      withCredentials: true
    });
  }

  public getAllDccPidList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerDCCUrl}/d-dcc/listAllDccPid`);
    // return this.http.get<string[]>(`${this.apiServerUrl}/d-dcc/listAllDccPid`);
  }
  public getOwnAndPublicDccList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerDCCUrl}/d-dcc/coordinatorListPidAndPublic`);
    // return this.http.get<string[]>(`${this.apiServerUrl}/d-dcc/coordinatorListPidAndPublic`);

  }
  public getPublicDccList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerDCCUrl}/d-dcc/dccPublicPidList`);
    // return this.http.get<string[]>(`${this.apiServerUrl}/d-dcc/dccPublicPidList`);
  }

  getAllDccsPaged(page: number, size: number): Observable<Page<Dcc>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Dcc>>(`${this.apiServerDCCUrl}/d-dcc/allDccList`, { params });
    // return this.http.get<Page<Dcc>>(`${this.apiServerUrl}/d-dcc/allDccList`, { params });
  }

  public uploadDcc(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiServerDCCUrl}/d-dcc/upload`, formData);
    // return this.http.post(`${this.apiServerUrl}/d-dcc/upload`, formData);
  }
  public onViewXml(pid: string): Observable<any> {
    return this.http.get(`${this.apiServerDCCUrl}/d-dcc/downloadXml?pid=${encodeURIComponent(pid)}`, {
    // return this.http.get(`${this.apiServerUrl}/d-dcc/downloadXml?pid=${encodeURIComponent(pid)}`, {
      observe: 'response',
      responseType: 'blob'
    });
  }
  getPagedCoordinatorDccList(page: number, size: number): Observable<Page<Dcc>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Dcc>>(`${this.apiServerDCCUrl}/d-dcc/publicAndCoordinatorDccList`, { params });
    // return this.http.get<Page<Dcc>>(`${this.apiServerUrl}/d-dcc/publicAndCoordinatorDccList`, { params });
  }

  verifyTimestamp(pid: string): Observable<string> {
    const params = new HttpParams().set('pid', pid);
    return this.http.post(`${this.apiServerDCCUrl}/d-dcc/verify`, null, {
      // return this.http.post(`${this.apiServerUrl}/d-dcc/verify`, null, {
      params,
      responseType: 'text'
    });
  }
  verifyTsr(pid: string): Observable<TimestampVerificationResult> {
    const url = `${this.apiServerDCCUrl}/d-dcc/verify?pid=${encodeURIComponent(pid)}`;
    // const url = `${this.apiServerUrl}/d-dcc/verify?pid=${encodeURIComponent(pid)}`;
    return this.http.post<TimestampVerificationResult>(url, null); // null, weil POST ohne Body
  }
  public deleteDccByPid(pid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerDCCUrl}/d-dcc/deleteByPid/${pid}`);
    // return this.http.delete<void>(`${this.apiServerUrl}/d-dcc/deleteByPid/${pid}`);
  }
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServerDCCUrl}/d-dcc/users`, { withCredentials: true });
    // return this.http.get<any[]>(`${this.apiServerUrl}/d-dcc/users`, { withCredentials: true });
  }
  changePassword(data: { oldPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(`${this.apiServerDCCUrl}/d-dcc/change-password`, data, {
    // return this.http.put(`${this.apiServerUrl}/d-dcc/change-password`, data, {
      responseType: 'text'
    });
  }
  deleteUserById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerDCCUrl}/d-dcc/delete/users/${id}`);
    // return this.http.delete<void>(`${this.apiServerUrl}/d-dcc/delete/users/${id}`);

  }
  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerDCCUrl}/d-dcc/addUser`, user);
    // return this.http.post<User>(`${this.apiServerUrl}/d-dcc/addUser`, user);

  }
  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerDCCUrl}/d-dcc/edit/users/${id}`, user);
    // return this.http.put<User>(`${this.apiServerUrl}/d-dcc/edit/users/${id}`, user);


  }

}
