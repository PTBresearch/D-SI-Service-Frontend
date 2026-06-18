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
 * LAST MODIFIED:		 02.10.25, 16:08
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthServiceService} from "../services/auth-service.service";
import {Router} from "@angular/router";

// @Injectable()
// export class BasicAuthInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthServiceService) {}
//
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const credentials = this.authService.getCredentials();
//
//     if (credentials) {
//       const authHeader = 'Basic ' + btoa(`${credentials.userName}:${credentials.password}`);
//
//       const authReq = req.clone({
//         setHeaders: {
//           Authorization: authHeader
//         }
//       });
//       return next.handle(authReq);
//     }
//
//     return next.handle(req);
//   }
//
// }
@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const credentials = this.authService.getCredentials();

    let authReq = req;

    if (credentials) {
      const authHeader =
        'Basic ' + btoa(`${credentials.userName}:${credentials.password}`);

      authReq = req.clone({
        setHeaders: {
          Authorization: authHeader
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401 || error.status === 403) {
          this.authService.logout(); // optional, aber empfohlen

          this.router.navigate(
            ['/login'],
            { queryParams: { expired: true } }
          );
        }

        return throwError(() => error);
      })
    );
  }
}
