
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {UnitModel} from "../model/dsiconverter.model";


@Injectable({
  providedIn: 'root'
})
export class SirpConverterService {
  // private apiServerUrl=environment.apiConverterUrl;
  // constructor(private  http: HttpClient) { }
  // public getData(): Observable<string>{
  //   return this.http.get<string>(`${this.apiServerUrl}/si/unit/{name}`);
  // }
  private dataUrl = 'assets/data-unit.json'; // Pfad zur JSON-Datei

  constructor(private http: HttpClient) {}

  // getUnitData(): Observable<String> {
  //   return this.http.get<String>(this.dataUrl);
  // }

  private apiUrl = environment.apiBaseUrl;



  getUnitData(name: string): Observable<any> {
    const url = `${this.apiUrl}/si/unit?entity=${name}`;
    return this.http.get<any>(url);
  }



}
