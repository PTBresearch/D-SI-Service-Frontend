import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {Participant} from "../model/participant.model";

import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Report} from "../model/report.model";


@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  private apiServerUrl=environment.apiClientBaseUrl;
  constructor(private  http: HttpClient) { }
  public getParticipants():  Observable<Participant[]>{
    return this.http.get<Participant[]>(`${this.apiServerUrl}/client/participants`);
  }
  public addParticipant(participant: Participant): Observable<Participant>{
    return this.http.post<Participant>(`${this.apiServerUrl}/client/addParticipant`, participant);
  }
  public onDeleteParticipant(participant: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/client/delete/${participant}`);
  }
  public onDeleteAll(): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/client/deleteAll`);
  }
  public getReports():  Observable<Report>{
    return this.http.get<Report>(`${this.apiServerUrl}/client/report`);
  }
  public getPidReport(): Observable<string>{
    return this.http.get<string>(`${this.apiServerUrl}client/report/{pidReport}`);
  }
  public addReport(report: Report): Observable<Report>{
    return this.http.post<Report>(`${this.apiServerUrl}/client/addReport`, report);
  }

  public download():Observable<any> {
    return this.http.get(`${this.apiServerUrl}/client/download`,{
      observe:'response', responseType:'blob'
    });
  }
}
