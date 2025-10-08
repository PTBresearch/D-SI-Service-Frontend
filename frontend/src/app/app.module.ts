import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ConstantComponent } from './components/constant/constant.component';
import { DkeycomparisonComponent } from './components/dkeycomparison/dkeycomparison.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {HashLocationStrategy, LocationStrategy, PathLocationStrategy} from "@angular/common";
import { ErrorComponent } from './components/error/error.component';
import { SawaggerComponent } from './components/sawagger/sawagger.component';
import { DsiconverterComponent } from './components/dsiconverter/dsiconverter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatRadioModule} from "@angular/material/radio";
import { MatButtonModule } from '@angular/material/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTableModule} from "@angular/material/table";
import {MatMenuModule} from "@angular/material/menu";
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import {MatFormFieldModule} from "@angular/material/form-field";

import { MatDialogModule } from '@angular/material/dialog';
import {BasicAuthInterceptor} from "./core.interceptors/basic-auth.interceptor";
import {MatTooltipModule} from "@angular/material/tooltip";
import { TimestampVerificationDialogComponent } from './components/timestamp-verification-dialog/timestamp-verification-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConstantComponent,
    DkeycomparisonComponent,
    NavBarComponent,
    FooterComponent,
    ErrorComponent,
    SawaggerComponent,
    DsiconverterComponent,
    ChangePasswordDialogComponent,
    TimestampVerificationDialogComponent,
    ConfirmDialogComponent,

  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        Ng2SearchPipeModule,
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        MatRadioModule,
        MatButtonModule,
        NgbModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatDialogModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatTooltipModule
    ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},  {
    provide: HTTP_INTERCEPTORS,
    useClass: BasicAuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
