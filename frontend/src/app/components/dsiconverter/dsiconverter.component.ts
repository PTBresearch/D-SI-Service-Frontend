import {Component, Input, OnInit} from '@angular/core';
import {SirpConverterService} from "../../services/sirpconverter.service";
import {HttpClient, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-dsiconverter',
  templateUrl: './dsiconverter.component.html',
  styleUrls: ['./dsiconverter.component.css']
})
export class DsiconverterComponent implements OnInit {
  showResults: boolean = false;
  inputValue: string = ''
  unitData: any = {};

  constructor(private sirpConverterService: SirpConverterService) {
  }

  ngOnInit(): void {
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
}
