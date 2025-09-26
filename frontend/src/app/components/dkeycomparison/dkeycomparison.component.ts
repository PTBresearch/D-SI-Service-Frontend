import {Component, OnInit} from '@angular/core';
import {ContributionsService} from "../../services/contributions.service";
import {Contribution} from "../../model/contribution.model";
import {
  FormBuilder, FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppDataState, DataStateEnum} from "../../state/participant.state";
import {Report} from "../../model/report.model";
import {Dcc} from "../../model/Dcc.model";
import {MatRadioChange} from "@angular/material/radio";


@Component({
  selector: 'app-dkeycomparison',
  templateUrl: './dkeycomparison.component.html',
  styleUrls: ['./dkeycomparison.component.css']
})
export class DkeycomparisonComponent implements OnInit {
  title = 'dsi-Services';
  public contributions$?: Observable<AppDataState<Contribution[]>>;
  public dccPidList$?: Observable<AppDataState<Dcc[]>>;
  contributionFormGroup?: FormGroup;
  readonly DataStateEnum = DataStateEnum;
  public reports$?: Observable<AppDataState<Report>>;
  reportFormGroup?: FormGroup<any>;
  searchText: any;
  property: string = '';
  options: string[] = ['reference', 'excluded'];
  selectedOption: string = '';

  //Login
  isLoggedIn: Boolean = false;
  showLogin: Boolean = false;
  loginFormGroup!: FormGroup;
  username = '';
  adminSignedIn = false;
  coordinatorSignedIn = false;

  //Tab-Anzeige
  activeTab = 1; // Startet mit dem ersten Tab
  //dcc-list
  dccArray: string[] = ['dcc1', 'dcc2', 'dcc3'];
  displayedColumnsDcc: string[] = ['id', 'valid', 'pid', 'status', 'base64xml', 'actions'];
  //Upload
  showUploadDcc: Boolean = false;
  dccUploadFormGroup!: FormGroup; //Form-Group-Objekt (erzeugt über FormBuilder)
  //User-List
  userArray: string[] = ['user1', 'user2', 'user3'];
  displayedColumnsUsers: string[] = ['username', 'email','role', 'active', 'actions'];



  constructor(private contributionsService: ContributionsService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.getContributions();
    this.getDccList();
    this.contributionFormGroup = this.fb.group({
      participantName: ["", Validators.required],
        pidDCC: ["", Validators.required],
      pilotParticipantName: ["select pilot ParticipantName"],
      selectedOption: new FormControl(''),
      property: new FormControl('')
      }
    )

    this.getReports();
    this.reportFormGroup = this.fb.group({
      pidReport: ["", Validators.required],
      smartStandardEvaluationMethod: ["", Validators.required],
      pilotParticipantName:["", Validators.required],
    })
    this.clearContributionsList();

    //Login-FormGroup
    this.loginFormGroup = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    // Upload-FormGroup
    this.dccUploadFormGroup = this.fb.group({
      pid: ["", Validators.required],
      status:["", Validators.required],
      valid: ["", Validators.required],
      user: ["", Validators.required],
      xml: [null, Validators.required]
    });
  }

  public getContributions(): void {
       this.contributions$ = this.contributionsService.getContributions().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data: data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

  public onDeleteContribution(c: Contribution) {
    if (confirm("Are you sure to delete " + c.participantName))
      this.contributionsService.onDeleteContribution(c.id).subscribe(data => {
        this.getContributions();
      });
  }

  public clearContributionsList() {
    this.contributionsService.onDeleteAll().subscribe(data => {

    });
  }



  public addContribution() {
    this.contributionsService.addContribution(this.contributionFormGroup?.value)
      .subscribe(data => {
        this.getContributions()
      });
    this.contributionFormGroup?.reset();
// Setze den Wert auf null (keine Auswahl)
    this.contributionFormGroup?.get('selectedOption')?.setValue(null);

    console.log('selectedOption value after reset:', this.contributionFormGroup?.get('selectedOption')?.value);

    //sessionStorage.setItem('participnatsList', JSON.stringify( this.participantsService.getParticipants()))
  }

  public getReports(): void {

    this.reports$ = this.contributionsService.getReports().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data: data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

  public addReport() {
    this.contributionsService.addReport(this.reportFormGroup?.value)
      .subscribe(data => {
        this.getReports()
        // alert("added successfully")
      });
    this.reportFormGroup?.reset({smartStandardEvaluationMethod: ""});
  }

  public onDownload(): any {
    this.addReport();
    this.contributionsService.getPidReport();
    this.contributionsService.download().subscribe(
      response => {
        let fileName = (response.headers.get('Content-Disposition').split(';')[1].split('filename')[1].split('=')[1].trim());
        let blob: Blob = response.body as Blob;
        let a = document.createElement('a');
        console.log("file: ", fileName)
        a.download = fileName ;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      }
    );
    this.contributionsService.getPidReport();
  }

  public getDccList(): void {
    this.dccPidList$ = this.contributionsService.getDccList().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data: data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

  selectedEvalMethod(e: any) {
    console.log("smartStandardEvaluationMethod: ", e.target.value)
  }
  selectedPilotParticipantName(e: any) {
    console.log("PilotParticipantName: ", e.target.value)
  }
  selectedProperty(event: MatRadioChange) {
    const value = event.value;
    // @ts-ignore
    this.contributionFormGroup.get('selectedOption')?.setValue(value);
    // @ts-ignore
    this.contributionFormGroup.get('property')?.setValue(value);
  }

  onLogin() {
    this.isLoggedIn = true;
    this.adminSignedIn = true;
    this.showLogin = false;
    this.loginFormGroup.reset();
  }

  onCancelLogin() {
    this.showLogin = false;
    this.loginFormGroup.reset();

    const username = this.loginFormGroup.value.username;
    const password = this.loginFormGroup.value.password;

    //Call Auth-Service (Login)
  }

  onLogout() {
    this.isLoggedIn = false;
    this.adminSignedIn = false;
    this.username = '';
    console.log('User logged out');
  }

  onChangePassword() {

  }

  onEditDCC(dcc: Dcc) {

  }

  onDeleteDCC(dcc: Dcc) {

  }

  onViewXML(dcc: Dcc) {

  }

  onUploadDcc() {
    //contributionService
  }

  onCancelUploadDcc() {


    this.showUploadDcc = false;
    this.dccUploadFormGroup.reset({
      status: '',
      user: ''});


  }

  onAddUser() {

  }

  onEditUser() {

  }

  onDeleteUser() {

  }


}


