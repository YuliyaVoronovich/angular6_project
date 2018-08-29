import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
/*import 'rxjs/Rx';*/
import {Company} from '../_models/company.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/catch';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {CompanyService} from './company.service';
import {LoginService} from './login.service';

@Injectable()
export class CompanyResolve implements Resolve<any> {

  constructor(private companyService: CompanyService,
              private route: Router,
              private loginService: LoginService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    const id = route.params['id'];
    return this.companyService.getCompany(+id)
      .catch(error => {
        console.error(error);
        if (error.status === 401) {
          this.loginService.logout();
          this.route.navigate(['']);
        }
        if (error.status === 404) {
          this.route.navigate(['404']);
        }
        if (error.status === 403) {
          this.route.navigate(['403']);
        }
        return Observable.empty();
      });
  }
}
