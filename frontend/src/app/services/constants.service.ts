import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Constant} from "../model/Sciconstant.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  private apiServerUrl=environment.apiBaseUrl;
  constructor(private  http: HttpClient) {}
  public getConstantList(): Observable<Constant[]>{
    return this.http.get<Constant[]>(`${this.apiServerUrl}/d-siConstantJson`);
  }
  public getConstantXml(): Observable<string>{
    return this.http.get<string>(`${this.apiServerUrl}/d-constantJson/{name}`);
  }
}
