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
  private apiServerUrl = environment.apiBaseUrl;
  private dataUrl = 'assets/data-unit.json'; // Pfad zur JSON-Datei

  constructor(private http: HttpClient) {
  }

  private apiUrl = environment.apiBaseUrl;

  getUnitData(name: string): Observable<any> {
    const url = `${this.apiUrl}/si/unit?entity=${name}`;
    return this.http.get<any>(url);
  }

  public getSuggestions() : Observable<string[]>{
    return this.http.get<string[]>(`${this.apiServerUrl}/siconverter/getUnits`);
  }


  public convert(xml: string): Observable<string> {
    return this.http.post(
      `${this.apiServerUrl}/siconverter/convert`,
      xml,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/xml'
        }),
        responseType: 'text'
      }
    );

  }

}
