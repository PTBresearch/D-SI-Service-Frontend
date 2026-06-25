import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {UnitModel} from "../model/dsiconverter.model";
import {ConversionRequest} from "../model/ConversionRequest";
import {ConversionResponse} from "../model/ConversionResponse";


@Injectable({
  providedIn: 'root'
})
export class SirpConverterService {

  private dataUrl = 'assets/data-unit.json'; // Pfad zur JSON-Datei

  constructor(private http: HttpClient) {
  }

  private apiUrl = environment.apiBaseUrl;

  getUnitData(name: string): Observable<any> {
    const url = `${this.apiUrl}/si/unit?entity=${name}`;
    return this.http.get<any>(url);
  }
  public convert(xml: any): Observable<ConversionResponse>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/xml'
    });
    return this.http.post<ConversionResponse>('http://localhost:12345/api/v1/convert',xml,{headers})

  }

}
