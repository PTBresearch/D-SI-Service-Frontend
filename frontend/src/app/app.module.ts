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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    Ng2SearchPipeModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
