import {Component, OnInit} from '@angular/core';
import {ContributionsService} from "../../services/contributions.service";
import {Contribution} from "../../model/contribution.model";
import {
  FormBuilder, FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {catchError, finalize, map, Observable, of, startWith, tap} from "rxjs";
import {AppDataState, DataStateEnum} from "../../state/participant.state";
import {Report} from "../../model/report.model";
import {Dcc} from "../../model/Dcc.model";
import {MatRadioChange} from "@angular/material/radio";
import {User} from "../../model/User.model";
import {MatTableDataSource} from "@angular/material/table";
import {AuthServiceService} from "../../services/auth-service.service";
import {ChangePasswordDialogComponent} from "../change-password-dialog/change-password-dialog.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-dkeycomparison',
  templateUrl: './dkeycomparison.component.html',
  styleUrls: ['./dkeycomparison.component.css']
})
export class DkeycomparisonComponent implements OnInit {
  title = 'dsi-Services';
  contributions$?: Observable<AppDataState<Contribution[]>>;
  dccPidList$?: Observable<AppDataState<Dcc[]>>;
  contributionFormGroup!: FormGroup;
  readonly DataStateEnum = DataStateEnum;
  reports$?: Observable<AppDataState<Report>>;
  reportFormGroup?: FormGroup;
  searchText: any;
  property: string = '';
  options: string[] = ['reference', 'excluded'];
  selectedOption: string = '';
  submitted = false;
  //Login

  showLogin: Boolean = false;
  loginFormGroup!: FormGroup;
  username = '';
  adminSignedIn = false;
  coordinatorSignedIn = false;
  isLoggedIn = false;

  //Tab-Anzeige
  activeTab = 1; // Startet mit dem ersten Tab
  dccList$: Observable<Dcc[]> | undefined;
  showUploadDcc = false;
  dccUploadFormGroup!: FormGroup;

  users: User[] = [];
  displayedColumnsUser: string[] = ['userName', 'email', 'role', 'active' ,'actions'];
  dccList = this.contributionsService.getDccList();
  displayedColumnsDcc: string[] = [ 'pid',  'information', 'status','createdAt', 'actions'];
  selectedFile: File | null = null;
  constructor(private contributionsService: ContributionsService, private fb: FormBuilder, private authService:AuthServiceService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.getContributions();
    this.getDccList();
    this.getPublicDccList();
    this.contributionFormGroup = this.fb.group({
      participantName: ["", Validators.required],
      pidDCC: ["", Validators.required],
      pilotParticipantName: ["select pilot ParticipantName"],
      selectedOption: new FormControl(''),
      property: new FormControl('')
      }
    )

    this.contributionFormGroup.get('pidDCC')?.valueChanges.subscribe(value => {});
    this.loadUsers();
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

    this.reloadDccList();

    this.dccUploadFormGroup = this.fb.group({
      pid: ['', Validators.required],
      information: ['', Validators.required],
      status: ['', Validators.required],
      xmlFile: [null, Validators.required]
    });

    this.isLoggedIn = this.authService.isLoggedIn();

    // Du kannst auch auf Änderungen reagieren, falls AuthService ein Observable bietet:
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
  // onChangePassword() {
  //   // Hier kannst du z. B. ein Dialog-Fenster für Passwortänderung öffnen
  //   console.log('Change password clicked');
  // }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.dccUploadFormGroup.patchValue({
        xmlFile: this.selectedFile
      });
      this.dccUploadFormGroup.get('xmlFile')?.markAsTouched();
      this.dccUploadFormGroup.get('xmlFile')?.updateValueAndValidity();
    }
  }
  onUploadDcc(): void {
    this.submitted = true;
    if (this.dccUploadFormGroup.invalid || !this.selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append('pid', this.dccUploadFormGroup.value.pid);
    formData.append('status', this.dccUploadFormGroup.value.status);
    formData.append('information', this.dccUploadFormGroup.value.information);
    formData.append('file', this.selectedFile);


    this.contributionsService.uploadDcc(formData)
      .pipe(finalize(() => {
        this.reloadDccList();
      }))
      .subscribe({
        next: () => this.closeUploadPopup(),
        error: (err) => {
          if (err.status === 202) {
            this.closeUploadPopup();
          } else {
            console.error('Upload failed', err);

          }
        }
      });
  }

  closeUploadPopup() {
    this.showUploadDcc = false;
    this.dccUploadFormGroup.reset();
    this.selectedFile = null;

  }

  onCancelUploadDcc(): void {
    this.dccUploadFormGroup.reset();
   this.selectedFile = null;
    this.showUploadDcc = false;
  }

  reloadDccList(): void {
    this.dccList$ = this.contributionsService.getAll().pipe(
      tap(dccs => console.log('Neue DCCs geladen:', dccs)),
      catchError(() => of([]))
    );
  }

  onEditDcc(dcc: Dcc): void {
    console.log('Edit clicked for:', dcc);
  }

  onDeleteDcc(dcc: Dcc): void {
    console.log('Delete clicked for:', dcc);
  }

  onViewXml(dcc: Dcc): void {
    console.log('View XML clicked for:', dcc);
  }

  // onDeleteDcc(dcc: Dcc): void {
  //   this.contributionsService.deleteDcc(dcc.id).subscribe(() => {
  //     this.loadDccs();
  //   });
  // }
  //

  //
  // onViewXml(dcc: Dcc): void {
  //   const xmlWindow = window.open('', '_blank');
  //   xmlWindow?.document.write(`<pre>${atob(dcc.xmlBase64)}</pre>`);
  // }

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
    this.contributionFormGroup?.get('selectedOption')?.setValue(null);

    console.log('selectedOption value after reset:', this.contributionFormGroup?.get('selectedOption')?.value);
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
    this.dccList$ = this.contributionsService.getDccList().pipe(
      map(data => data),
      catchError(err => {
        console.error('Fehler beim Laden der DCCs:', err);
        return of([]);
      })
    );
  }
  public getPublicDccList(): void {
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
    if (this.loginFormGroup.invalid) {
      console.warn('Form invalid');
      return;
    }
    const credentials = {
      userName: this.loginFormGroup.value.username,
      password: this.loginFormGroup.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (user) => {
        console.log('Login success:', user);
        this.isLoggedIn = true;
        this.username = user.userName;

        // Rollen prüfen
        if (user.role === 'ADMIN') {
          this.adminSignedIn = true;
        } else if (user.role === 'COORDINATOR') {
          this.coordinatorSignedIn = true;
        }

        this.showLogin = false;
        this.loginFormGroup.reset();
      },
      error: (err) => {
        alert('Login failed: ' + (err.error?.message || 'Invalid credentials'));
      }
    });
  }
  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.adminSignedIn = false;
    this.coordinatorSignedIn = false;
    this.username = '';
  }

  onCancelLogin() {
    this.showLogin = false;
    this.loginFormGroup.reset();

    const username = this.loginFormGroup.value.username;
    const password = this.loginFormGroup.value.password;

    //Call Auth-Service (Login)
  }
  onChangePassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.changePassword(result.oldPassword, result.newPassword).subscribe({
          next: () => alert('Password changed successfully.'),
          error: err => alert('Failed to change password: ' + err.error?.message || err.message),
        });
      }
    });
  }
  loadUsers(): void {
    this.contributionsService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.map(user => ({
          userName: user.userName,
          email: user.email,
          role: user.role,
          active: user.activ
        }));
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }



  onEditUser(user: User) {
    // implement edit logic
    console.log('Edit user:', user);
  }

  onDeleteUser(user: User) {
    // implement delete logic
    console.log('Delete user:', user);
  }

  onEditDCC(dcc: Dcc) {

  }



  onViewXML(dcc: Dcc) {

  }


  onAddUser() {

  }



}
