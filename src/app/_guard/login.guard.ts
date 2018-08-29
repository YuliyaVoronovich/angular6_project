import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {LoginService} from '../_services/login.service';
import 'rxjs/add/observable/of';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private loginService: LoginService,
              private route: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    /*const isLoggedIn = this.loginService.isLoggedInBack();
    console.log(isLoggedIn);
    return isLoggedIn;*/
    return this.loginService.checkLogin().map(
      response => {
        if (!response.error) {
          return true;
        }
      })
      .catch(error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.route.navigate(['/']);
          return Observable.of(false);
        }
      })
      ;
  }
}
