import {Component, OnInit} from '@angular/core';
import {ContributionsService} from "../../services/contributions.service";
import {Contribution} from "../../model/contribution.model";
import {
  FormBuilder, FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {BehaviorSubject, catchError, finalize, map, Observable, of, startWith, tap} from "rxjs";
import {AppDataState, DataStateEnum} from "../../state/participant.state";
import {Report} from "../../model/report.model";
import {Dcc} from "../../model/Dcc.model";
import {MatRadioChange} from "@angular/material/radio";
import {User} from "../../model/User.model";
import {AuthServiceService} from "../../services/auth-service.service";
import {ChangePasswordDialogComponent} from "../change-password-dialog/change-password-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {TimestampVerificationResult} from "../../model/timestampVerificationResult.model";
import {
  TimestampVerificationDialogComponent
} from "../timestamp-verification-dialog/timestamp-verification-dialog.component";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'app-dkeycomparison',
  templateUrl: './dkeycomparison.component.html',
  styleUrls: ['./dkeycomparison.component.css']
})
export class DkeycomparisonComponent implements OnInit {
  title = 'dsi-Services';

  // Auth & User
  isLoggedIn = false;
  username: string | null = '';
  adminSignedIn = false;
  coordinatorSignedIn = false;
  showLogin: boolean = false;

  // FormGroups
  contributionFormGroup!: FormGroup;
  reportFormGroup?: FormGroup;
  loginFormGroup!: FormGroup;
  dccUploadFormGroup!: FormGroup;

  // Contribution & Report
  contributions$?: Observable<AppDataState<Contribution[]>>;
  reports$?: Observable<AppDataState<Report>>;
  searchText: any;

  // DCC
  private dccListSubject = new BehaviorSubject<Dcc[]>([]);
  public dccList$ = this.dccListSubject.asObservable();
  dccList = this.contributionsService.getPublicCoordinatorDccList();
  dccPidList$?: Observable<AppDataState<string[]>>;
  showUploadDcc = false;
  selectedFile: File | null = null;
  displayedColumnsDcc: string[] = ['pid', 'information', 'status', 'createdAt', 'actions'];

 // verification
  verificationResult: TimestampVerificationResult | null = null;
  verificationError: string | null = null;
  isLoadingVerification = false;

  // Users
  users: any[] = [];
  displayedColumnsUser: string[] = ['userName', 'email', 'role', 'active', 'actions'];

  // UI
  activeTab = 1;
  submitted = false;

  // Auswahloptionen
  options: string[] = ['reference', 'excluded'];
  selectedOption: string = '';
  property: string = '';
  readonly DataStateEnum = DataStateEnum;

  constructor(
    private contributionsService: ContributionsService,
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.authService.restoreSession();

    this.initForms();
    this.getContributions();
    this.getReports();
    this.clearContributionsList();

    const role = this.authService.getUserRole();
    if (role === 'ADMIN') this.adminSignedIn = true;
    if (role === 'COORDINATOR') this.coordinatorSignedIn = true;

    // DCC-Liste basierend auf Rolle laden
    if (!this.adminSignedIn && !this.coordinatorSignedIn) {
      this.loadPublicDccListOnly();
    }
    this.loadDccListByRole();
    this.reloadDccList();

    // Benutzer laden (nur Admin)
    if (this.authService.isAdmin()) {
      this.loadUsers();
    }

    // Rolle ändern → DCCs und User aktualisieren
    this.authService.userRole$.subscribe(role => {
      this.reloadDccList();
      if (role === 'ADMIN') this.loadUsers();
    });

    // Loginstatus überwachen
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.username = this.authService.getCurrentUserName();

    // Reagiere auf PID-DCC-Änderungen
    this.contributionFormGroup.get('pidDCC')?.valueChanges.subscribe();
  }

  private initForms(): void {
    this.contributionFormGroup = this.fb.group({
      participantName: ["", Validators.required],
      pidDCC: ["", Validators.required],
      pilotParticipantName: ["select pilot ParticipantName"],
      selectedOption: new FormControl(''),
      property: new FormControl('')
    });

    this.reportFormGroup = this.fb.group({
      pidReport: ["", Validators.required],
      smartStandardEvaluationMethod: ["", Validators.required],
      pilotParticipantName: ["", Validators.required]
    });

    this.loginFormGroup = this.fb.group({
      username: ["", Validators.required],
      password: ['', [Validators.required, Validators.minLength(12)]]
    });

    this.dccUploadFormGroup = this.fb.group({
      pid: ['', Validators.required],
      information: ['', Validators.required],
      status: ['', Validators.required],
      xmlFile: [null, Validators.required]
    });
  }

  onLogin(): void {
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
        this.isLoggedIn = true;
        this.username = user.userName;
        this.adminSignedIn = user.role === 'ADMIN';
        this.coordinatorSignedIn = user.role === 'COORDINATOR';

        this.loadDccListByRole();
        this.showLogin = false;
        this.loginFormGroup.reset();
      },
      error: (err) => {
        alert('Login failed: ' + (err.error?.message || 'Invalid credentials'));
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.adminSignedIn = false;
    this.coordinatorSignedIn = false;
    this.username = '';
    this.loadDccListByRole();
    this.contributionFormGroup.reset();
    this.reportFormGroup?.reset();
  }

  onCancelLogin(): void {
    this.showLogin = false;
    this.loginFormGroup.reset();
  }

  onChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {width: '400px'});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.changePassword(result.oldPassword, result.newPassword).subscribe({
          next: () => alert('Password changed successfully.'),
          error: err => alert('Failed to change password: ' + err.error?.message || err.message),
        });
      }
    });
  }

// Contributions laden (Observable mit State)
  public getContributions(): void {
    this.contributions$ = this.contributionsService.getContributions().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

// Contribution hinzufügen
  public addContribution(): void {
    if (this.contributionFormGroup.invalid) return;

    this.contributionsService.addContribution(this.contributionFormGroup.value).subscribe(() => {
      this.getContributions();
    });

    this.contributionFormGroup.reset();
    this.contributionFormGroup.get('selectedOption')?.setValue(null);

    console.log('selectedOption value after reset:', this.contributionFormGroup.get('selectedOption')?.value);
  }

// Contribution löschen mit Bestätigung
  public onDeleteContribution(c: Contribution): void {
    if (confirm("Are you sure to delete " + c.participantName)) {
      this.contributionsService.onDeleteContribution(c.id).subscribe(() => {
        this.getContributions();
      });
    }
  }

// Alle Contributions löschen (leeren)
  public clearContributionsList(): void {
    this.contributionsService.onDeleteAll().subscribe(() => {
      // Optional: Nach dem Löschen erneut laden
      this.getContributions();
    });
  }

// Reports laden (Observable mit State)
  public getReports(): void {
    this.reports$ = this.contributionsService.getReports().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

// Report hinzufügen
  public addReport(): void {
    if (this.reportFormGroup?.invalid) return;

    this.contributionsService.addReport(this.reportFormGroup?.value).subscribe(() => {
      this.getReports();
    });

    this.reportFormGroup?.reset({smartStandardEvaluationMethod: ""});
  }

// Download auslösen (erst Report hinzufügen, dann Datei anfragen)
  public onDownload(): void {
    this.addReport();
    this.contributionsService.getPidReport();
    this.contributionsService.download().subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'downloaded_file';
      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches && matches[1]) {
          fileName = matches[1];
        }
      }
      const blob: Blob = response.body as Blob;
      const a = document.createElement('a');
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      a.click();
    });
  }

  selectedEvalMethod(e: any): void {
    console.log("smartStandardEvaluationMethod: ", e.target.value);
  }

  selectedPilotParticipantName(e: any): void {
    console.log("PilotParticipantName: ", e.target.value);
  }

  selectedProperty(event: MatRadioChange): void {
    const value = event.value;
    this.contributionFormGroup.get('selectedOption')?.setValue(value);
    this.contributionFormGroup.get('property')?.setValue(value);
  }

// DCC Liste je nach Rolle laden
//   reloadDccList(): void {
//     let request$: Observable<Dcc[]>;
//
//     if (this.authService.isAdmin()) {
//       request$ = this.contributionsService.getAllDccList(); // Admin
//     } else if (this.authService.isCoordinator()) {
//       request$ = this.contributionsService.getPublicCoordinatorDccList(); // Koordinator
//     } else {
//       request$ = of([]); // Public, leer
//     }
//
//     this.dccList$ = request$.pipe(
//       tap(dccs => console.log('DCCs geladen:', dccs)),
//       catchError(err => {
//         console.error('Fehler beim Laden der DCCs:', err);
//         return of([]);
//       })
//     );
//   }

  reloadDccList(): void {
    console.log(' reloadDccList wurde aufgerufen');

    let request$: Observable<Dcc[]>;

    if (this.authService.isAdmin()) {
      request$ = this.contributionsService.getAllDccList();
    } else if (this.authService.isCoordinator()) {
      request$ = this.contributionsService.getPublicCoordinatorDccList();
    } else {
      request$ = of([]);
    }

    request$
      .pipe(
        catchError(err => {
          console.error(' Fehler beim Laden der DCCs:', err);
          return of([]);
        })
      )
      .subscribe(dccs => {
        console.log('Neue DCCs geladen:', dccs);
        this.dccListSubject.next(dccs);
      });
  }


// Laden der DCC PID Liste je nach Rolle (Observable mit DataState)
  loadDccListByRole(): void {
    let request$: Observable<string[]>;

    if (this.authService.isAdmin()) {
      request$ = this.contributionsService.getAllDccPidList();
    } else if (this.authService.isCoordinator()) {
      request$ = this.contributionsService.getOwnAndPublicDccList();
    } else {
      request$ = this.contributionsService.getPublicDccList();
    }

    this.dccPidList$ = request$.pipe(
      tap(data => console.log('Loaded PIDs:', data)),
      map(data => ({dataState: DataStateEnum.LOADED, data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({
        dataState: DataStateEnum.ERROR,
        errorMessage: err.message || 'Error loading the DCC list'
      }))
    );
  }

// Optional: Nur Public DCC laden (für nicht angemeldete Nutzer)
  loadPublicDccListOnly(): void {
    this.dccPidList$ = this.contributionsService.getPublicDccList().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({
        dataState: DataStateEnum.ERROR,
        errorMessage: err.message || 'Error loading the Public DCC list'
      }))
    );
  }

// VerifyTsr

  onVerifyTsr(dcc: any): void {
    this.contributionsService.verifyTsr(dcc.pid).subscribe({
      next: (result) => {
        this.dialog.open(TimestampVerificationDialogComponent, {
          width: '600px',
          data: result
        });
      },
      error: (err) => {
        alert('Verification failed: ' + (err?.error || 'Unknown error'));
      }
    });
  }
  onDeleteDcc(dcc: Dcc): void {
    console.log('Delete clicked for:', dcc);
  }

  confirmDelete(dcc: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: `Do you really want to delete the DCC with PID "${dcc.pid}" ?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDccByPid(dcc.pid);
      }
    });
  }

  deleteDccByPid(pid: string): void {
    this.contributionsService.deleteDccByPid(pid).subscribe({
      next: () => {
        console.log('DCC gelöscht mit PID:', pid);
        this.reloadDccList();
      },
      error: (err) => {
        alert('Delete failed: ' + (err?.error?.message || 'Unknown error'));
      }
    });
  }

// Download
  onViewXml(dcc: any): void {
    this.contributionsService.onViewXml(dcc.pid).subscribe({
      next: response => {
        const blob = new Blob([response.body!], { type: 'application/xml' });

        // Filename aus Content-Disposition Header extrahieren
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'dcc.xml';
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        // Download starten
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        if (err.status === 404) {
          alert('DCC not fond.');
        } else if (err.status === 204) {
          alert('DCC has no content.');
        } else {
          alert('Error downloading the file.');
        }
      }
    });
  }

// Datei auswählen und validieren (nur .xml erlaubt)
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();

      if (!fileName.endsWith('.xml')) {
        alert('Please upload a valid XML file with the extension .xml.');
        input.value = ''; // Reset Input
        return;
      }

      this.selectedFile = file;
      this.dccUploadFormGroup.patchValue({xmlFile: this.selectedFile});
      this.dccUploadFormGroup.get('xmlFile')?.markAsTouched();
      this.dccUploadFormGroup.get('xmlFile')?.updateValueAndValidity();
    }
  }

// DCC Upload ausführen
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
      .pipe(finalize(() => this.reloadDccList()))
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

// Upload Popup schließen und Form zurücksetzen
  closeUploadPopup(): void {
    this.showUploadDcc = false;
    this.dccUploadFormGroup.reset();
    this.selectedFile = null;
  }

// Upload abbrechen
  onCancelUploadDcc(): void {
    this.dccUploadFormGroup.reset();
    this.selectedFile = null;
    this.showUploadDcc = false;
  }

// Benutzer laden (nur Admins)
  loadUsers(): void {
    this.contributionsService.getAllUsers().subscribe({
      next: (data) => {
        console.log('Data loaded:', data);
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading the user:', err);
      }
    });
  }

// User bearbeiten (Platzhalter)
  onEditUser(user: User): void {
    console.log('Edit user:', user);
  }

// User löschen (Platzhalter)
  onDeleteUser(user: User): void {
    console.log('Delete user:', user);
  }

// User hinzufügen (Platzhalter)
  onAddUser(): void {
    console.log('Add user clicked');
  }

}
