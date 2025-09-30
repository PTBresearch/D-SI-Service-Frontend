/*
 * Copyright (c) 2022-2025  Physikalisch-Technische Bundesanstalt (PTB), all rights reserved.
 * This source code and software is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, version 3 of the License.
 * The software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License
 * along with this Code.  If not, see http://www.gnu.org/licenses.
 * CONTACT: 		info@ptb.de
 * DEVELOPMENT:		https://d-si.ptb.de
 * AUTHORS:		Wafa El Jaoua, Tobias Hoffmann, Clifford Brown, Daniel Hutzschenreuter
 * LAST MODIFIED:		 29.09.25, 23:59
 */

import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {User} from "../model/User.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiServerDCCUrl = environment.apiDCCUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  constructor(private http: HttpClient) { }


  login(credentials: { userName: string; password: string }): Observable<any> {
    return this.http.post<User>(`${this.apiServerDCCUrl}/d-dcc/login`, credentials, {
      context: undefined,
      observe: "body",
      params: undefined,
      reportProgress: false,
      withCredentials: false,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  logout() {
    localStorage.removeItem('username');
    this.currentUserSubject.next(null);
  }

  get currentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserSnapshot(): User | null {
    return this.currentUserSubject.value;
  }


  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  isCoordinator(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'COORDINATOR';
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiServerDCCUrl}/d-dcc/change-password`, {
      oldPassword,
      newPassword
    });
  }
}
