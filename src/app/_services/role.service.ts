import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
/*import 'rxjs/Rx';*/
import {Role} from '../_models/role.model';
import 'rxjs/add/operator/map';
import {Globals} from '../_common/globals';

@Injectable()
export class RoleService {

  public uri = '/admin/roles';


  constructor(private http: Http,
              private globals: Globals) {
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

  update(role: Role): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + role.id, JSON.stringify(role));
  }
}
