import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ConstantComponent } from './components/constant/constant.component';
import { DkeycomparisonComponent } from './components/dkeycomparison/dkeycomparison.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
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
    MatFormFieldModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
