import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../modules/auth/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    //  No autenticado
    if (!this.authService.isAuthenticated()) {
      this.handleUnauthenticated(state.url);
      return false;
    }

    //  Token expirado
    if (this.authService.isTokenExpired()) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      return false;
    }

    //  Normalizar URL como el backend
    const cleanUrl = this.normalizeUrl(state.url);

    //  Sin permiso por módulo / endpoint
    if (!this.authService.checkRoutePermission(cleanUrl)) {
      this.router.navigate(['/auth/not-authorized']);
      return false;
    }

    return true;
  }

  private normalizeUrl(url: string): string {
    return url.split('?')[0].toLowerCase();
  }
  private handleUnauthenticated(returnUrl: string): void {
    this.authService.logout();
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl },
    });
  }
}
