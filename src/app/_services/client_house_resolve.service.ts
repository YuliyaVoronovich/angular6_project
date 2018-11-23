import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
/*import 'rxjs/Rx';*/
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/catch';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {ClientHouseService} from './client_house.service';

@Injectable()
export class ClientHouseResolve implements Resolve<any> {

  constructor(private clientHouseService: ClientHouseService,
              private route: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    const id = route.params['id'];
    return this.clientHouseService.getClient(+id)
      .catch(error => {
        console.error(error);
        if (error.status === 401) {
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
