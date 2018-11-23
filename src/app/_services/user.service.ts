import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import {Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent} from 'rxjs';
/*import 'rxjs/Rx';*/
import {User} from '../_models/User.model';
import 'rxjs/add/operator/map';
import {UserInformation} from '../_models/UserInformation.model';
import {Globals} from '../_common/globals';
import {Router} from '@angular/router';

@Injectable()
export class UserService {

  public uri = '/users';
  public admin_uri = '/admin/users';
  public path = '';

  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
    this.getPathUrl();
  }

  getPathUrl() {

    const location = window.location.pathname;
    location.split('/').forEach(element => {
      if (element !== '' && this.path === '') {
        this.path = element;
      }
    });
    if (this.path === 'admin') {
      this.uri = this.admin_uri;
    }
 //   console.log('route: ' + this.uri); // Root path
  }


  getUsers(search = {}): Observable<User[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().users
      );
  }

  getUser(id) {
    return this.http.get(this.globals.url + this.uri + '/user/' + id)
      .map((response: Response) => response.json()
      );
  }

  create(user: User): Observable<Response> {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(user));
  }

  update(user: User): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + user.id, JSON.stringify(user));
  }

  ban(user: User | number): Observable<Response> {
    const id = typeof user === 'number' ? user : user.id;
    return this.http.post(this.globals.url + this.uri + '/ban/' + id, JSON.stringify(user));
  }

  unban(user: User | number): Observable<Response> {
    const id = typeof user === 'number' ? user : user.id;
    return this.http.post(this.globals.url + this.uri + '/unban/' + id, JSON.stringify(user));
  }

  delete(user: User | number): Observable<Response> {
    const id = typeof user === 'number' ? user : user.id;
    return this.http.post(this.globals.url + this.uri + '/' + id, JSON.stringify(user));
  }

  setUser(user: User) {
    if (!user) {
      return user = new User(null, '', '', null, null, null, '',
        0, null, null, false, null, null, '', null, null, null);
    }
    return user;
  }

  setUserInformation(user: User) {
    if (!user.user_information) {
      return user.user_information = new UserInformation(null, '', '', '', '', '', '', null, []);
    }
    return user.user_information;
  }

}
