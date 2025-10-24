import { Component } from '@angular/core';
import {Title} from "@angular/platform-browser";

import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: any;
  uuid = uuidv4();
  constructor(private titleService:Title) {
    this.titleService.setTitle("D-SI Services");
  }

}
