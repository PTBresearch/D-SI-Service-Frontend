import {Component, Input, OnInit} from '@angular/core';
import {SirpConverterService} from "../../services/sirpconverter.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

import {FormControl, FormGroup} from "@angular/forms";

import {MatDialog} from "@angular/material/dialog";
import {ConversionRequest} from "../../model/ConversionRequest";
import {ConversionResponse} from "../../model/ConversionResponse";
import {ValidationErrorResponse} from "../../model/ValidationErrorResponse";
import {NotificationDialog} from "../notification-dialog/notification-dialog";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-dsiconverter',

  templateUrl: './dsiconverter.component.html',
  styleUrls: ['./dsiconverter.component.css']
})
export class DsiconverterComponent implements OnInit {
  showResults: boolean = false;
  inputValue: string = ''
  unitData: any = {};
  parser = new DOMParser();


  units: String[] = [];
  result$ = new BehaviorSubject<number | null>(null);
  form : any = new FormGroup({
    fromUnit: new FormControl(''),
    toUnit: new FormControl(''),
    inputValue: new FormControl<number | null>(null)
  });

  constructor(private sirpConverterService: SirpConverterService, private dialog: MatDialog) {
   var  dummy: string[] = ["\\kelvin", "\\metre" , "\\kilo"];
   this.units = dummy;
  }

  ngOnInit(): void {
  }
  public swap() : void {
    const fromUnit = this.form.get('fromUnit')?.value;
    const toUnit = this.form.get('toUnit')?.value;

    this.form.patchValue({
      fromUnit: toUnit,
      toUnit: fromUnit
    });
  }
  public convertSi(): void {

    const xml = this.buildXml();

    this.sirpConverterService.convert(xml).subscribe({
      next: (res: string) => {
        console.log('RAW Response:', res);

        const value = this.parseResult(res);
        console.log('Parsed value:', value);

        this.result$.next(value ?? 0);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error:', err);
      }
    });

  }

  // stabiler mit XPath
  private parseResult(res: string): number | null {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(res, 'text/xml');

    const node = xmlDoc.getElementsByTagNameNS(
      'https://ptb.de/si',
      'value'
    )[0];

    return node?.textContent ? Number(node.textContent) : null;
  }

  // Robuste Methode
  // private parseResult(res: string): number | null {
  //   const parser = new DOMParser();
  //   const xmlDoc = parser.parseFromString(res, 'text/xml');
  //
  //   const valueNode = xmlDoc.getElementsByTagName('si:value')[0];
  //
  //   const value = valueNode?.textContent;
  //
  //   return value ? Number(value) : null;
  // }
  convert() {
    this.sirpConverterService.getUnitData(this.inputValue).subscribe(
      (response: HttpResponse<any>) => {

        this.unitData = response;
        this.showResults = true;
      }
    );
  }

  resetResults() {
    this.showResults = false;
    this.unitData = {};
  }

  private buildXml(): string {
    const data = this.form.value;

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>
<conversionInput xmlns="https://ptb.de/si/conversion">
  <fromQuantityValue>
    <real xmlns="https://ptb.de/si">
      <value>${data.inputValue}</value>
      <unit>${data.fromUnit}</unit>
    </real>
  </fromQuantityValue>
  <toUnit>
    <unit>${data.toUnit}</unit>
  </toUnit>
</conversionInput>`;

    return xml.trim();
  }

}

