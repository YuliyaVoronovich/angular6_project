import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/index';
import {Injectable} from '@angular/core';

import {HouseService} from './house.service';

@Injectable()
export class HouseResolve implements Resolve<any> {

  constructor(private houseService: HouseService,
              private route: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    const id = route.params['id'];
    return this.houseService.getHouse(+id)
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
