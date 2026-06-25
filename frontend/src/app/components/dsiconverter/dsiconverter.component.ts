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

  public convertSi() :void {

    // const conversionRequest: ConversionRequest = {
    //   value: this.form.value.inputValue,
    //   fromUnit: this.form.value.fromUnit,
    //   toUnit: this.form.value.toUnit
    // }

    const xml = this.buildXml();


    this.sirpConverterService.convert(xml).subscribe({
      next: (res: ConversionResponse): void => {
        this.result$.next(res.result)
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error) {
          const validationError: ValidationErrorResponse = err.error;
          const messages: string[] = [
            validationError.message,
            ...validationError.errors.map(e => `${e.field}: ${e.message}`)
          ];
          this.dialog.open(NotificationDialog, {
            data: messages
          });
        } else {
          console.error('Anderer Fehler:', err.message);
        }
      }
    })
  }



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

  private  buildXml(){
    const data = this.form.value
    const xml:string = `
    <?xml version="1.0" encoding="UTF-8"?>
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
    </conversionInput>`
    const xmlDoc = this.parser.parseFromString(xml, 'application/xml');

    return xmlDoc;

  }
}

