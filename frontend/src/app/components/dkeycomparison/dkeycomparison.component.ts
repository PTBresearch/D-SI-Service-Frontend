
import {Component, OnDestroy, OnInit, ElementRef, ViewChild, HostListener, Inject} from '@angular/core';
import {ContributionsService} from "../../services/contributions.service";
import {Contribution} from "../../model/contribution.model";
import {
  FormBuilder, FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  forkJoin,
  map,
  Observable,
  of,
  startWith,
  tap,
  TimeoutError
} from "rxjs";
import {AppDataState, DataStateEnum} from "../../state/participant.state";
import {Report} from "../../model/report.model";
import {Dcc} from "../../model/Dcc.model";
import {MatRadioChange} from "@angular/material/radio";
import {User} from "../../model/User.model";
import {AuthServiceService} from "../../services/auth-service.service";
import {ChangePasswordDialogComponent} from "../change-password-dialog/change-password-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TimestampVerificationResult} from "../../model/timestampVerificationResult.model";
import {
  TimestampVerificationDialogComponent
} from "../timestamp-verification-dialog/timestamp-verification-dialog.component";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {PageEvent} from "@angular/material/paginator";
import {Page} from "../../model/page.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserAddDialogComponent} from "../user-add-dialog/user-add-dialog.component";
import { timeout } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-dkeycomparison',
  templateUrl: './dkeycomparison.component.html',
  styleUrls: ['./dkeycomparison.component.css']
})
export class DkeycomparisonComponent implements OnInit {

  protected apiServerUrl = environment.apiBaseUrl;
  get isTestSystem(): boolean {
    return this.apiServerUrl.includes('http://a85279.berlin.ptb.de/api');
  }
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
  contributions$?: Observable<{
    data?: Contribution[];
    dataState: DataStateEnum;
    errorMessage?: string;
  }>;
  reports$?: Observable<AppDataState<Report>>;
  searchText: any;
  isLoading: boolean = false;
  // DCC
  private dccListSubject = new BehaviorSubject<Dcc[]>([]);
  public dccList$ = this.dccListSubject.asObservable();
  // dccList = this.contributionsService.getPublicCoordinatorDccList();
  dccPidList$?: Observable<AppDataState<string[]>>;
  showUploadDcc = false;
  selectedFile: File | null = null;
  displayedColumnsDcc: string[] = ['pid', 'information', 'status', 'createdAt', 'actions'];

  //Page
  totalDccs = 0;
  currentPage = 0;
  pageSize = 10;

  // verification
  verificationResult: TimestampVerificationResult | null = null;
  verificationError: string | null = null;
  isLoadingVerification = false;
  errorMessage: string | null = null;
  // Users
  users: any[] = [];
  displayedColumnsUser: string[] = ['userName', 'email', 'role', 'active', 'actions'];
  // UI
  activeTab = 1;
  submitted = false;

  // optionen
  options: string[] = ['reference', 'excluded'];
  @ViewChild('radioGroupElement') radioGroupElement!: ElementRef;
  selectedOption: string = '';
  property: string = '';
  // readonly DataStateEnum = DataStateEnum;
  //-------------------------------------------
  contributions: Contribution[] = [];
  reports: Report[] = [];
  sessionId: string = '';
  //-------------------------------------------
  protected dataState: DataStateEnum | undefined;
  constructor(
    private contributionsService: ContributionsService,
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {

    // console.log("Init: isLoggedIn =", this.isLoggedIn);


    this.loadContributions(this.sessionId);
    // this.loadReports();
    this.sessionId = sessionStorage.getItem('sessionId') || uuidv4();
    sessionStorage.setItem('sessionId', this.sessionId);


    this.initAddContributionForm();
    //-----------------------------
    this.initForms();

    // this.getReports();

    this.authService.restoreSession();
    const role = this.authService.getUserRole();
    if (role === 'ADMIN') this.adminSignedIn = true;
    if (role === 'COORDINATOR') this.coordinatorSignedIn = true;

    if (!this.adminSignedIn && !this.coordinatorSignedIn) {
      this.loadPublicDccListOnly();
    }
    this.loadDccListByRole();
    this.reloadDccList();

    if (this.authService.isAdmin()) {
      this.loadUsers();
    }

    // Rolle ändern
    this.authService.userRole$.subscribe(role => {
      this.reloadDccList();
      if (role === 'ADMIN') this.loadUsers();
    });

    // Loginstatus
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.username = this.authService.getCurrentUserName();

    // Reagiere auf PID-DCC-Änderungen
    this.contributionFormGroup.get('pidDCC')?.valueChanges.subscribe();
    this.reloadDccList(); // Seite 0
    this.clearContributionsList();


  }
  //--------------------


  private initAddContributionForm() {
    this.contributionFormGroup= this.fb.group({
      participantName: ['', Validators.required],
      contributionName: ['', Validators.required],
      pidDCC: ['', Validators.required],
      selectedOption: new FormControl('__include__'),
      property: new FormControl(null),
    });
  }

  loadContributions(sessionId: string) {
    this.contributions$ = this.contributionsService.getContributions(sessionId).pipe(
      map(data => ({
        data: data,
        dataState: DataStateEnum.LOADED
      })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError(error => of({
        dataState: DataStateEnum.ERROR,
        errorMessage: error.message || 'Unknown error'
      }))
    );
  }
  public onAddContribution() {
    if (this.contributionFormGroup.invalid) return;

    const newContribution = this.contributionFormGroup.value;

    this.contributionsService.addContribution(newContribution,this.sessionId).subscribe({
      next: () => {
        this.contributionFormGroup = this.fb.group({
          participantName: ["", Validators.required],
          contributionName: ['', Validators.required],
          pidDCC: ["", Validators.required],
          pilotParticipantName: ["select pilot ParticipantName"],
          selectedOption: new FormControl('__include__'),
          property: new FormControl(null)
        });

        this.loadContributions(this.sessionId);  // Liste aktualisieren
      },
      error: err => {
        console.error('Fehler beim Hinzufügen:', err);
      }
    });
  }

  deleteContribution(id: number): void {
    this.contributionsService.onDeleteContribution(id, this.sessionId).subscribe(() => {
      this.loadContributions(this.sessionId);
    });
  }

  loadReports(): void {
    this.contributionsService.getReports(this.sessionId).subscribe(data => {
      this.reports = [data];  // Annahme: Nur ein Bericht
    });
  }

  public addReport(): void {
    this.contributionsService.addReport(this.reportFormGroup?.value, this.sessionId)
      .subscribe(() => {
        this.getReports();
      });
  }
  //-----------------------
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.reloadDccList();
  }

  private initForms(): void {
    this.contributionFormGroup = this.fb.group({
      participantName: ["", Validators.required],
      contributionName: ['', Validators.required],
      pidDCC: ["", Validators.required],
      pilotParticipantName: [""],
      selectedOption: new FormControl('__include__'),
      property: new FormControl(null)
    });

    this.reportFormGroup = this.fb.group({
      pidReport: ["", Validators.required],
      smartStandardEvaluationMethod: ["", Validators.required],
      pilotParticipantName: ["", Validators.required]
    });

    this.loginFormGroup = this.fb.group({
      username: ["", Validators.required],
      password: ['', [Validators.required]]
    });
    //, Validators.minLength(12)
    this.dccUploadFormGroup = this.fb.group({
      pid: ['', Validators.required],
      information: ['', Validators.required],
      status: ['', Validators.required],
      xmlFile: [null, Validators.required]
    });
  }
  private resetContributionAndReportForms(): void {
    this.contributionFormGroup = this.fb.group({
      participantName: ["", Validators.required],
      contributionName: ['', Validators.required],
      pidDCC: ["", Validators.required],
      pilotParticipantName: ["select pilot ParticipantName"],
      selectedOption: new FormControl('__include__'),
      property: new FormControl(null)
    });

    this.reportFormGroup = this.fb.group({
      pidReport: ["", Validators.required],
      smartStandardEvaluationMethod: ["", Validators.required],
      pilotParticipantName: ["", Validators.required]
    });
  }
  onOpenLogin(): void {
    this.showLogin = true;
    document.body.classList.add('modal-open');
    // console.log('Login-Fenster geöffnet');
  }

  onLogin(): void {
    this.errorMessage = '';
    if (this.loginFormGroup.invalid) {
      console.warn('Form invalid');
      return;
    }

    const credentials = {
      userName: this.loginFormGroup.value.username,
      password: this.loginFormGroup.value.password
    };
    this.clearContributionsList();
    this.initForms();

    // this.reportFormGroup?.reset();
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
    this.errorMessage = '';
    this.authService.logout();
    this.isLoggedIn = false;
    this.adminSignedIn = false;
    this.coordinatorSignedIn = false;
    this.username = '';
    this.loadDccListByRole();
    this.contributionFormGroup.reset();
    this.initForms();
    this.clearContributionsList();
    this.contributions$ = of({
      dataState: DataStateEnum.LOADED,
      data: []
    });
  }

  onCancelLogin(): void {
    this.showLogin = false;
    this.loginFormGroup.reset();
    document.body.classList.remove('modal-open');
  }
  onChangePassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contributionsService.changePassword(result).subscribe({
          next: () => {
            this.snackBar.open('Password changed successfully', 'Close', {
              duration: 3000,
            });
          },
          error: err => {
            console.error('Fehler beim Passwortwechsel:', err);
            this.snackBar.open(
              err?.error || 'Error changing password',
              'Close',
              { duration: 5000 }
            );
          }
        });
      }
    });
  }

  public getReports(): void {
    const sessionId = this.sessionId;

    const reportData = this.reportFormGroup?.value;

    // Optional: Konsolen-Check, ob contributionList gesetzt ist
    if (reportData?.contributionList?.length > 0) {
      console.log("contributionList ist korrekt gesetzt:", reportData.contributionList);
    } else {
      console.log("contributionList");
    }

    this.reports$ = this.contributionsService.getReports(sessionId).pipe(
      map(data => ({ dataState: DataStateEnum.LOADED, data: data })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError(err => of({ dataState: DataStateEnum.ERROR, errorMessage: err.message }))
    );
  }
  // public onDownload(): void {
  //   console.log('CLICK');
  //
  //   this.errorMessage = null;
  //   this.isLoading = true;
  //
  //   console.log('calling getPidReport');
  //   this.contributionsService.getPidReport().subscribe({
  //     next: () => {
  //       console.log('getPidReport DONE');
  //
  //       console.log('calling download');
  //       this.contributionsService.download(this.sessionId).subscribe({
  //         next: res => {
  //           console.log('download response', res);
  //         },
  //         error: err => {
  //           console.error('download error', err);
  //         }
  //       });
  //     },
  //     error: err => {
  //       console.error('getPidReport error', err);
  //     }
  //   });
  // }

  public onDownload(): any {
    this.errorMessage = null;
    this.isLoading = true;
    // this.contributionsService.getPidReport();
    this.contributionsService.download(this.sessionId).pipe(
      timeout(30000) // 30 Sekunden Timeout
    ).subscribe({
      next: response => {
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
        // this.clearContributionsList();
      },
      error: err => {
        if (err instanceof TimeoutError) {
          this.errorMessage = 'The download took too long. Please try again.';
        } else {
          this.errorMessage = 'An error occurred during the download.';
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.resetContributionAndReportForms();

      }
    });
  }



  public onDeleteContribution(c: Contribution): void {
    if (confirm("Are you sure to delete " + c.participantName)) {
      const sessionId = this.sessionId;
      this.contributionsService.onDeleteContribution(c.id, sessionId).subscribe(() => {
        this.loadContributions(this.sessionId);
      });
    }
  }


  public clearContributionsList(): void {
    const sessionId = this.sessionId;
    this.contributionsService.deleteAllContributions(sessionId).subscribe(() => {
      this.loadContributions(this.sessionId);    // Liste neu laden
    });
  }

  // public onDeleteContributionsList(): void {
  //   const sessionId = this.sessionId;
  //   this.contributionsService.deleteAllContributions(sessionId).subscribe(() => {
  //     this.loadContributions(this.sessionId);    // Liste neu laden
  //   });
  // }
  public onDeleteContributionsList(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: `Are you sure you want to delete contributions list?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.contributionsService
          .deleteAllContributions(this.sessionId)
          .subscribe(() => {
            this.loadContributions(this.sessionId);
          });
     }
    });

  }
  // public onDeleteContributionsList(): void {
  //   const confirmed = window.confirm(
  //     'Are you sure you want to delete all participants?'
  //   );
  //
  //   if (!confirmed) {
  //     return;
  //   }
  //
  //   const sessionId = this.sessionId;
  //
  //   this.contributionsService
  //     .deleteAllContributions(sessionId)
  //     .subscribe(() => {
  //       this.loadContributions(sessionId);
  //     });
  // }

  selectedEvalMethod(e: any): void {
    console.log("smartStandardEvaluationMethod: ", e.target.value);
  }

  selectedPilotParticipantName(e: any): void {
    console.log("PilotParticipantName: ", e.target.value);
  }

  // selectedProperty(event: MatRadioChange): void {
  //   const value = event.value;
  //   this.contributionFormGroup.get('selectedOption')?.setValue(value);
  //   this.contributionFormGroup.get('property')?.setValue(value);
  // }
  selectedProperty(event: MatRadioChange): void {
    const value = event.value;

    // Wenn der Wert "__include__" ist → nichts setzen
    if (value === '__include__') {
      this.clearSelection();
      return;
    }

    this.contributionFormGroup.get('selectedOption')?.setValue(value);
    this.contributionFormGroup.get('property')?.setValue(value);
  }

  clearSelection(event?: Event): void {
    if (event) {
      event.stopPropagation(); // verhindert doppeltes Triggern
    }
    this.contributionFormGroup.get('selectedOption')?.setValue('__include__');
    this.contributionFormGroup.get('property')?.setValue(null);
  }

  reloadDccList(): void {
    console.log('reloadDccList wurde aufgerufen');

    let request$: Observable<Page<Dcc>>;

    if (this.authService.isAdmin()) {
      request$ = this.contributionsService.getAllDccsPaged(this.currentPage, this.pageSize);
    } else if (this.authService.isCoordinator()) {
      request$ = this.contributionsService.getPagedCoordinatorDccList(this.currentPage, this.pageSize);
    } else {
      // nicht eingeloggt
      this.dccListSubject.next([]);
      this.totalDccs = 0;
      return;
    }

    request$
      .pipe(
        catchError(err => {
          console.error('Fehler beim Laden der DCCs:', err);
          this.dccListSubject.next([]);
          this.totalDccs = 0;
          return of(null);
        })
      )
      .subscribe(result => {
        if (result) {
          // console.log('Neue DCCs geladen:', result.content);
          this.dccListSubject.next(result.content);
          this.totalDccs = result.totalElements;
        }
      });
  }

  // loadDccListByRole(): void {
  //   let request$: Observable<string[]>;
  //   request$ = this.contributionsService.getAllDccPidList();
  //   this.dccPidList$ = request$.pipe(
  //     tap(data => console.log('Loaded PIDs:', data)),
  //     map(data => ({dataState: DataStateEnum.LOADED, data})),
  //     startWith({dataState: DataStateEnum.LOADING}),
  //     catchError(err => of({
  //       dataState: DataStateEnum.ERROR,
  //       errorMessage: err.message || 'Error loading the DCC list'
  //     }))
  //   );
  // }

  loadPublicDccListOnly(): void {
    this.dccPidList$ = this.contributionsService.getAllDccPidList().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({
        dataState: DataStateEnum.ERROR,
        errorMessage: err.message || 'Error loading the Public DCC list'
      }))
    );
  }

// VerifyTsr

  onVerifyTsr(input: any): void {
    let pid: string;

    if (typeof input === 'string') {
      // Wenn String, prüfen ob URL oder nur PID
      pid = input.includes('/dcc/') ? input.split('/dcc/')[1] : input;
    } else if (input && typeof input === 'object' && input.pid) {
      // Wenn Objekt mit pid-Feld
      pid = input.pid;
    } else {
      alert('Ungültiger Input für PID!');
      return;
    }

    this.contributionsService.verifyTsr(pid).subscribe({
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
        console.log('DCC deleted with PID:', pid);
        this.reloadDccList();
      },
      error: (err) => {
        alert('Delete failed: ' + (err?.error?.message || 'Unknown error'));
      }
    });
  }

  onViewXml(input: any): void {
    let pid: string;

    if (typeof input === 'string') {
      // Wenn String, prüfen ob URL oder nur PID
      pid = input.includes('/dcc/') ? input.split('/dcc/')[1] : input;
    } else if (input && typeof input === 'object' && input.pid) {
      //  pid-Feld
      pid = input.pid;
    } else {
      alert('Ungültiger Input für PID!');
      return;
    }

    this.contributionsService.onViewXml(pid).subscribe({
      next: response => {
        const blob = new Blob([response.body!], { type: 'application/xml' });

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = pid+ '.xml';
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        if (err.status === 404) {
          alert('DCC not found.');
        } else if (err.status === 204) {
          alert('DCC has no content.');
        } else {
          alert('Error downloading the file.');
        }
      }
    });
  }



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

  closeUploadPopup(): void {
    this.showUploadDcc = false;
    this.dccUploadFormGroup.reset();
    this.selectedFile = null;
  }


  onCancelUploadDcc(): void {
    this.dccUploadFormGroup.reset();
    this.selectedFile = null;
    this.showUploadDcc = false;
  }


  loadUsers(): void {
    this.contributionsService.getAllUsers().subscribe({
      next: (data) => {
        // console.log('Data loaded:', data);
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading the user:', err);
      }
    });
  }

  onAddUser(): void {
    const dialogRef = this.dialog.open(UserAddDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contributionsService.addUser(result).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (err) => {
            alert('User konnte nicht hinzugefügt werden.');
            console.error(err);
          }
        });
      }
    });
  }

  onEditUser(user: User): void {
    const dialogRef = this.dialog.open(UserAddDialogComponent, {
      width: '400px',
      data: user // Bestehender User wird übergeben
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contributionsService.updateUser(user.id, result).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: err => {
            console.error('Fehler beim Aktualisieren:', err);
            alert('Update fehlgeschlagen.');
          }
        });
      }
    });
  }

  onDeleteUser(user: User): void {
    if (confirm(`Delete user ${user.userName}?`)) {
      this.contributionsService.deleteUserById(user.id).subscribe({
        next: () => {
          console.log('User deleted:', user);
          this.loadUsers();
        },
        error: err => {
          console.error('error when deleting:', err);
          alert('Delete failed.');
        }
      });
    }
  }

  onForgotPassword() {
    alert(' Please contact the administrator at d-si@ptb.de to receive a new temporary login password.');
  }
  publicDccPidList: string[] = [];
  privateDccPidList: string[] = [];
  filteredDccPids: string[] = [];



  loadDccListByRole(): void {
    // beide Listen parallel laden
    forkJoin({
      publicList: this.contributionsService.getPublicPidDccList(),
      privateList: this.contributionsService.getPrivatePidDccList()
    }).subscribe({
      next: ({ publicList, privateList }) => {
        console.log('Public DCCs:', publicList);
        // console.log('Private DCCs:', privateList);
        this.publicDccPidList = publicList;
        this.privateDccPidList = privateList;
      },
      error: (err) => console.error('Error loading DCC lists', err)
    });
  }
  // loadDccListByRole(): void {
  //   forkJoin({
  //     publicList: this.contributionsService.getPublicPidDccList(),
  //     privateList: this.contributionsService.getPrivatePidDccList()
  //   }).subscribe({
  //     next: ({ publicList, privateList }) => {
  //       // Zusammenführen und als Observable setzen
  //       this.dccPidList$ = of({
  //         dataState: DataStateEnum.LOADED,
  //         data: [...publicList, ...privateList]
  //       });
  //       this.publicDccPidList = publicList;
  //       this.privateDccPidList = privateList;
  //     },
  //     error: (err) => {
  //       console.error('Error loading DCC lists', err);
  //       this.dccPidList$ = of({
  //         dataState: DataStateEnum.ERROR,
  //         errorMessage: err.message || 'Error loading DCC lists'
  //       });
  //     }
  //   });
  // }

  onPidSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!value) {
      this.filteredDccPids = [];
      return;
    }

    const filteredPublic = this.publicDccPidList.filter(pid =>
      pid.toLowerCase().includes(value.toLowerCase())
    );

    const filteredPrivate = this.privateDccPidList.filter(pid =>
      pid === value
    );

    this.filteredDccPids = [...filteredPrivate, ...filteredPublic];
  }


  selectPid(pid: string): void {
    this.contributionFormGroup.get('pidDCC')?.setValue(pid);
    this.filteredDccPids = [];
  }

  // // -------
  //
  // onFileSelected1(event: any) {
  //   this.selectedFile = event.target.files[0];
  // }
  //
  // upload() {
  //   if (!this.selectedFile) {
  //     return;
  //   }
  //
  //   this.isLoading = true;
  //
  //   const reader = new FileReader();
  //
  //   reader.onload = () => {
  //     const base64String = (reader.result as string).split(',')[1];
  //     // entfernt "data:application/xml;base64,"
  //     // TODO Extract images from report
  //     // this.contributionsService.downloadZip(base64String)
  //     // .subscribe({
  //     //   next: (response: Blob) => {
  //     //     this.downloadZip(response);
  //     //     this.isLoading = false;
  //     //   },
  //     //   error: (err) => {
  //     //     console.error(err);
  //     //     this.isLoading = false;
  //     //   }
  //     // });
  //   };
  //
  //   reader.readAsDataURL(this.selectedFile);
  // }
  // downloadZip(blob: Blob) {
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //
  //   a.href = url;
  //   a.download = 'images.zip';
  //   a.click();
  //
  //   window.URL.revokeObjectURL(url);
  // }

  selectedFile1: File | null = null;
  statusMessage: string = '';


  // Datei auswählen
  onFileSelectedReport(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile1 = input.files[0];
      this.statusMessage = `Selected file: ${this.selectedFile1.name}`;
    }
  }

  // Upload und Download der ZIP
  upload() {
    if (!this.selectedFile1) {
      this.statusMessage = 'Please select file';
      return;
    }

    this.statusMessage = 'Upload is running...';

    this.contributionsService.uploadXml(this.selectedFile1).subscribe({
      next: (blob: Blob) => {
        if (blob.size === 0) {
          this.statusMessage = 'Error: empty ZIP file';
          return;
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'images.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        this.statusMessage = 'Download completed!';
      },
      error: (err) => {
        console.error(err);
        this.statusMessage = 'Error during upload';
      }
    });
  }


  protected readonly DataStateEnum = DataStateEnum;


}
