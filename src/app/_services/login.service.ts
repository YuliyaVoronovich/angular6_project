import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {User} from '../_models/user.model';
import {Globals} from '../_common/globals';

@Injectable()
export class LoginService {

  private token: string;
  private uri = '/login';
  private loginUri = '/check';

  constructor(private http: Http,
              private route: Router,
              private globals: Globals) {

  }

  doLogin(login: string, password: string): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.globals.url + this.uri, JSON.stringify({login: login, password: password}), {headers: headers})
      .map((response: Response) => {
        this.token = response.json().token;
        if (this.token) {
          localStorage.setItem('tokenUser', this.token);
          localStorage.setItem('array_roles', JSON.stringify(response.json().array_roles)); // массив привилегий
          return true;
        } else {
          return false;
        }
      });
  }

  getToken(): any {
    return localStorage.getItem('tokenUser');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): any {
    localStorage.removeItem('tokenUser');
  }

  checkLogin(): any {
    return this.http.get(this.globals.url + this.loginUri);
  }

  detailsUser(): any  {
    return this.http.get(this.globals.url + this.loginUri)
      .map((response: Response) => response.json());
  }

  setAccess(user: User): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/access/' + user.id, JSON.stringify(user));
  }

}
