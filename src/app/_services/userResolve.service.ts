import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
/*import 'rxjs/Rx';*/
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {UserService} from './user.service';

@Injectable()
export class UserResolve implements Resolve<any> {

  constructor(private userService: UserService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    const id = route.params['id'];
    return this.userService.getUser(+id)
      .catch(error => {
        console.error(error);
        if (error.status === 401) {
          this.router.navigate(['']);
        }
        if (error.status === 404) {
          this.router.navigate(['404']);
        }
        if (error.status === 403) {
          this.router.navigate(['403']);
        }
        return Observable.empty();
      });
  }

}
