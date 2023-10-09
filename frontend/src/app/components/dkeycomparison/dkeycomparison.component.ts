import {Component, OnInit} from '@angular/core';
import {ParticipantsService} from "../../services/participants.service";
import {Participant} from "../../model/participant.model";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {HttpErrorResponse, HttpEvent, HttpEventType} from '@angular/common/http';
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppDataState, DataStateEnum} from "../../state/participant.state";
import {Report} from "../../model/report.model";
import {saveAs} from "file-saver";


@Component({
  selector: 'app-dkeycomparison',
  templateUrl: './dkeycomparison.component.html',
  styleUrls: ['./dkeycomparison.component.css']
})
export class DkeycomparisonComponent implements OnInit {
  title = 'dsi-Services';

  public participants$?: Observable<AppDataState<Participant[]>>;
  participantFormGroup?: FormGroup;
  readonly DataStateEnum = DataStateEnum;
  public reports$?: Observable<AppDataState<Report>>;
  reportFormGroup?: FormGroup<any>;


  constructor(private participantsService: ParticipantsService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.getParticipants();
    this.participantFormGroup = this.fb.group({
        name: ["", Validators.required],
        pidDCC: ["", Validators.required]
      }
    )
    this.getReports();
    this.reportFormGroup = this.fb.group({
      pidReport: ["", Validators.required]
    })
    this.clearParticipantsList()
  }

  public getParticipants(): void {
    this.participants$ = this.participantsService.getParticipants().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data: data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

  public onDeleteParticipant(p: Participant) {
    let message = confirm("Are you sure to delete " + p.name);
    if (message = true)
      this.participantsService.onDeleteParticipant(p.id).subscribe(data => {
        this.getParticipants();
      });
  }

  public clearParticipantsList() {
    this.participantsService.onDeleteAll().subscribe(data => {

    });
  }

  public addParticipant() {
    this.participantsService.addParticipant(this.participantFormGroup?.value)
      .subscribe(data => {
        this.getParticipants()
        alert("added successfully")
      });
    this.participantFormGroup?.reset();
    //sessionStorage.setItem('participnatsList', JSON.stringify( this.participantsService.getParticipants()))
  }

  public getReports(): void {

    this.reports$ = this.participantsService.getReports().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data: data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

  public addReport() {
    this.participantsService.addReport(this.reportFormGroup?.value)
      .subscribe(data => {
        this.getReports()
        alert("added successfully")
      });
    this.reportFormGroup?.reset();
  }

  public onDownload(): any {
    this.addReport();
    this.participantsService.getPidReport();
    this.participantsService.download().subscribe(
      response => {
        let fileName = response.headers.get('Content-Disposition').split(';')[1].split('filename')[1].split('=')[1].trim();
        let blob: Blob = response.body as Blob;
        let a = document.createElement('a');
        console.log("file", fileName)
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      }
    );
    this.participantsService.getPidReport();
  }
}


