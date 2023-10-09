import { Component } from '@angular/core';
import {ConstantsService} from "../../services/constants.service";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppDataState} from "../../state/participant.state";

import {DataStateEnum} from "../../state/participant.state";
import {Constant} from "../../model/Constant.model";




@Component({
  selector: 'app-constant',
  templateUrl: './constant.component.html',
  styleUrls: ['./constant.component.css']
})
export class ConstantComponent {

  public constants$?: Observable<AppDataState<Constant[]>>;
  // public constants$?: Observable<AppDataState<Constant[]>>;
  public constant:any;
  readonly DataStateEnum = DataStateEnum;
  searchText: any;
  constructor(private constantsService: ConstantsService) {
  }
  ngOnInit() {
    this.getConstantList();
  }

  public getConstantList(): void {
    // @ts-ignore
    this.constants$ = this.constantsService.getConstantList().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data: data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

}
