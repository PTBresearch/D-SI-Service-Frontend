import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../model/User.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { LoginResponse } from "../model/LoginResponse.model";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiServerDCCUrl = environment.apiDCCUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(this.getStoredUser()?.role ?? null);
  public userRole$ = this.userRoleSubject.asObservable();

  private credentials: { userName: string; password: string } | null = null;

  constructor(private http: HttpClient) {}

  login(credentials: { userName: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiServerDCCUrl}/d-dcc/login`,
      credentials,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      tap(response => {
        // Speichern
        sessionStorage.setItem('user', JSON.stringify(response));
        sessionStorage.setItem('credentials', JSON.stringify(credentials));

        // Interner State setzen
        const user = response as unknown as User;
        this.currentUserSubject.next(user);
        this.userRoleSubject.next(user.role);
        this.credentials = credentials;
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('credentials');
    this.currentUserSubject.next(null);
    this.userRoleSubject.next(null);
    this.credentials = null;
  }

  // Aktuellen Benutzer als Snapshot holen
  getCurrentUserSnapshot(): User | null {
    return this.currentUserSubject.value;
  }

  // Benutzername aus Credentials holen
  getCurrentUserName(): string | null {
    return this.getCredentials()?.userName || null;
  }

  // Aus gespeicherten Userdaten lesen
  getStoredUser(): User | null {
    const userJson = sessionStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  getCredentials(): { userName: string; password: string } | null {
    const stored = sessionStorage.getItem('credentials');
    return stored ? JSON.parse(stored) : null;
  }

  // Rolle abrufen
  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  // Rolle setzen (z. B. manuell nach Rollenwechsel)
  setUserRole(role: string): void {
    const user = this.getStoredUser();
    if (user) {
      user.role = role;
      sessionStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.userRoleSubject.next(role);
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isCoordinator(): boolean {
    return this.getUserRole() === 'COORDINATOR';
  }

  isPublic(): boolean {
    return this.getUserRole() === null;
  }

  isLoggedIn(): boolean {
    return this.getStoredUser() !== null;
  }

  // Session aus sessionStorage wiederherstellen
  restoreSession(): void {
    const user = this.getStoredUser();
    const credentials = this.getCredentials();

    if (user && credentials) {
      this.currentUserSubject.next(user);
      this.userRoleSubject.next(user.role);
      this.credentials = credentials;
    }
  }

  // Passwort ändern
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiServerDCCUrl}/d-dcc/change-password`, {
      oldPassword,
      newPassword
    });
  }
}
