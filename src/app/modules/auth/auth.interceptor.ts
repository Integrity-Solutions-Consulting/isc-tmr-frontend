import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // Validar expiración antes de enviar request
    if (token && this.authService.isTokenExpired()) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      return throwError(() => new Error('Token expired'));
    }

    //  Agregar token
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        //  NO AUTENTICADO
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        }

        //  SIN PERMISOS POR MÓDULO (TU BACKEND)
        if (error.status === 403) {
          const message = error.error?.message || 'Sin acceso al módulo';

          //console.warn('Acceso denegado:', message);

          this.router.navigate(['/auth/not-authorized'], {
            queryParams: { reason: message },
          });

          return throwError(() => error);
        }

        return throwError(() => error);
      }),
    );
  }
}
