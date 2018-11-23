import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import 'rxjs/add/operator/map';
import {Globals} from '../_common/globals';
import {Permission} from '../_models/Permission.model';

@Injectable()
export class PermissionService {

  public uri = '/permissions';


  constructor(private http: Http,
              private globals: Globals) {
  }

  getPermissions(search = {}): Observable<Permission[]> {
    return this.http.get(this.globals.url + this.uri , {search: search})
      .map((response: Response) => response.json().permissions
      );
  }

  addPermissions(search = {}) {
    return this.http.get(this.globals.url + this.uri + '/user', {search: search})
      .map((response: Response) => response.json()
      );
  }

}
