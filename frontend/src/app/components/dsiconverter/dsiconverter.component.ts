import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {SirpConverterService} from "../../services/sirpconverter.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {NotificationDialog} from "../notification-dialog/notification-dialog";
import {BehaviorSubject} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {environment} from "../../../environments/environment";


interface Token {
  start: number;
  end: number;
  value: string;
  type: '#' | '\\';
}

@Component({
  selector: 'app-dsiconverter',

  templateUrl: './dsiconverter.component.html',
  styleUrls: ['./dsiconverter.component.css']
})
export class DsiconverterComponent implements OnInit {
  protected apiServerUrl = environment.apiBaseUrl;
  @ViewChild('searchInputFrom')
  searchInputFrom!: ElementRef<HTMLInputElement>;
  @ViewChild('searchInputTo')
  searchInputTo!: ElementRef<HTMLInputElement>;
  activeField: 'fromUnit' | 'toUnit' = 'fromUnit';
  showResults: boolean = false;
  inputValue: string = ''

  unitData: any = {};
  parser = new DOMParser();
  rawResponse: string | null = null;
  units: string[] = [];
  filteredSuggestions: string[] = [];
  result$ = new BehaviorSubject<number | null>(null);
  sMu$ = new BehaviorSubject<number | null>(null);
  notifications$ = new BehaviorSubject<string[] | null>(null);
  form : any = new FormGroup({
    fromUnit: new FormControl(''),
    toUnit: new FormControl(''),
    inputValue: new FormControl<number | null>(null),
    outputValue: new FormControl<number | null>(null)
  });
  private lastValue = '';
  private lastCursor = 0;

  constructor(private sirpConverterService: SirpConverterService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.sirpConverterService.getSuggestions().subscribe((res) =>{
      this.units = res;
    })
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
        this.form.patchValue({outputValue: null});
        this.rawResponse = res
        const value = this.parseResult(res);
        this.form.patchValue({
          outputValue: value
        })
        this.result$.next(value ?? 0);

        const toUnit = this.parseToUnit(res);
        this.form.patchValue({
          toUnit:toUnit
        })

        const sMu = this.parseSmu(res);
        this.sMu$.next(sMu ?? null);

        const notifications = this.parseNotifications(res);
        this.notifications$.next(notifications ?? null)

      },
      error: (err: HttpErrorResponse) => {
        this.form.patchValue({outputValue: null});
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
            data: JSON.parse(err.error) == null ? "Unknown error." : JSON.parse(err.error)
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

  clear(): void {
    this.form.reset({
      fromUnit: '',
      toUnit: '',
      inputValue: null,
      outputValue: null

    });
    this.notifications$.next(null);
    this.result$.next(null);
    this.sMu$.next(null);
    this.rawResponse = null;
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

  //===== Filter suggestions ===


  getCurrentToken(value: string, cursor: number): Token | null {
    let start = cursor - 1;
    while (start >= 0 && value[start] !== '#' && value[start] !== '\\') {
      start--;
    }
    if (start < 0) return null;
    const type = value[start] as '#' | '\\';
    let end = start + 1;
    while ( end < value.length && value[end] !== '#' && value[end] !== '\\' ) {
      end++;
    }
    return { start, end, type, value: value.substring(start, end) };
  }

  filter(value: string, cursor: number): void {
    const token = this.getCurrentToken(value, cursor);
    if (!token) {
      this.filteredSuggestions = [];
      return;
    }
    if (token.type === '#') {
      const alreadyHasHash = value.includes('#');
      if (alreadyHasHash && !value.startsWith('#')) {
        this.filteredSuggestions = [];
        return;
      }
      this.filteredSuggestions = this.units.filter(s => s.startsWith('#') && s.substring(1).toLowerCase().startsWith(token.value.substring(1).toLowerCase()) );
      return;
    }
    this.filteredSuggestions = this.units.filter(s => s.startsWith('\\') && s.substring(1).toLowerCase().startsWith(token.value.substring(1).toLowerCase()) );
  }


  onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    this.lastValue = input.value;
    this.lastCursor = input.selectionStart ?? input.value.length;

    this.filter(this.lastValue, this.lastCursor);
  }

  optionSelected(event: MatAutocompleteSelectedEvent, field: string) {

    const suggestion = event.option.value as string;
    const value = this.lastValue;
    const cursor = this.lastCursor;
    let newValue: string;
    if (suggestion.startsWith('#')) {
      newValue =  suggestion;
    } else {
      const lastSlash = value.lastIndexOf('\\', cursor - 1);
      newValue =
        value.substring(0, lastSlash) +
        suggestion +
        value.substring(cursor);
    }
      this.form.get(this.activeField)?.setValue(newValue);
        if(this.activeField === "fromUnit") {
          const inputEl = this.searchInputFrom.nativeElement;
          inputEl.value = newValue;
          inputEl.setSelectionRange(newValue.length, newValue.length);
          inputEl.focus();

        }
        if(this.activeField === "toUnit") {
          const inputEl = this.searchInputTo.nativeElement;
          inputEl.value = newValue;
          inputEl.setSelectionRange(newValue.length, newValue.length);
          inputEl.focus();

        }



  }


}

