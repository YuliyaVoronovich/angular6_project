import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import {Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent} from 'rxjs';
/*import 'rxjs/Rx';*/
import {Role} from '../_models/Role.model';
import 'rxjs/add/operator/map';
import {Globals} from '../_common/globals';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class RoleService {

  public uri = '/roles';
  public admin_uri = '/admin/roles';
  public path = '';

  constructor(private http: Http,
              private router: Router,
              private route: ActivatedRoute,
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
  //  console.log('route: ' + this.uri); // Root path
  }

  getRoles(search = {}): Observable<Role[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().roles
      );
  }

  getRole(id) {
    return this.http.get(this.globals.url + this.uri + '/role/' + id)
      .map((response: Response) => response.json());
  }

  create(role: Role): Observable<Response> {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(role));
  }

  update(role: Role): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + role.id, JSON.stringify(role));
  }
}
