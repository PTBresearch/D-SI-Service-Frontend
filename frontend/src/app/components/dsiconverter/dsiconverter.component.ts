import {Component, Input, OnInit} from '@angular/core';
import {SirpConverterService} from "../../services/sirpconverter.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
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
  rawResponse: string | null = null;
  units: String[] = [];
  result$ = new BehaviorSubject<number | null>(null);
  sMu$ = new BehaviorSubject<number | null>(null);
  notifications$ = new BehaviorSubject<string[] | null>(null);
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
        this.rawResponse = res
        console.log('RAW Response:', res);
        const value = this.parseResult(res);
        console.log('Parsed value:', value);
        this.result$.next(value ?? 0);

        const toUnit = this.parseToUnit(res);
        console.log('Parsed toUnit:', toUnit);
        this.form.patchValue({
          toUnit:toUnit
        })

        const sMu = this.parseSmu(res);
        console.log('Parsed uncertainty:', sMu);
        this.sMu$.next(sMu ?? null);

        const notifications = this.parseNotifications(res);
        this.notifications$.next(notifications ?? null)

      },
      error: (err: HttpErrorResponse) => {
        this.rawResponse = err.error
        const ct = err.headers.get('Content-Type');
        console.error('Error:', err.error);
        if(ct?.includes('xml')){

          this.sMu$.next(null);
          this.result$.next(null);
          const notifications = this.parseNotifications(err.error)
          this.notifications$.next(notifications ?? null)

        }

        if(ct?.includes('json') ){

          this.dialog.open(NotificationDialog, {
            data: JSON.parse(err.error)
          });

        }
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

  private parseToUnit(res: string): string | null {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(res, 'text/xml');

    const node = xmlDoc.getElementsByTagNameNS(
      'https://ptb.de/si',
      'unit'
    )[0];

    return node?.textContent ? (node.textContent) : null;
  }

  private parseSmu(res: string): number | null {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(res, 'text/xml');

    const node = xmlDoc.getElementsByTagNameNS(
      'https://ptb.de/si',
      'valueStandardMU'
    )[0];

    return node?.textContent ? Number(node.textContent) : null;
  }

  private parseNotifications(res: string) : string[] {
    let notifications: string[] = []
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(res, 'text/xml');

    const nodes = xmlDoc.getElementsByTagNameNS(
      'https://ptb.de/si/conversion',
      'notification'
    );


    Array.from(nodes).forEach(el => {
      if (el.textContent) {
        notifications.push(el.textContent);
      }
    })
  return notifications;
  }

  public showReport(){
    if (!this.rawResponse) {
      return;
    }
     const blob = new Blob([this.rawResponse], {
      type: 'application/xml'
    });

    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
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

