import {Component, NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DkeycomparisonComponent} from "./components/dkeycomparison/dkeycomparison.component";
import {ConstantComponent} from "./components/constant/constant.component";
import {HomeComponent} from "./components/home/home.component";
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
import {ErrorComponent} from "./components/error/error.component";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "d-constant", component: ConstantComponent},
  {path: "home", component: HomeComponent},
  {path: "d-comparison", component: DkeycomparisonComponent},
  { path: 'error', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  providers: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
