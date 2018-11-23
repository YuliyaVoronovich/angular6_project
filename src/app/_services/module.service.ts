import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
/*import 'rxjs/Rx';*/
import 'rxjs/add/operator/map';
import {Module} from '../_models/Module.model';
import {Globals} from '../_common/globals';

@Injectable()
export class ModuleService {

  public uri = '/admin/modules';

  /* headers;*/

  constructor(private http: Http,
              private globals: Globals) {}

  getModules(search = {}): Observable<Module[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().modules
      );
  }

  create(module: Module): Observable<Response> {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(module));
  }

  update(module: Module): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + module.id, JSON.stringify(module));
  }

  delete(module: Module | number): Observable<Response> {
    const id = typeof module === 'number' ? module : module.id;
    return this.http.post(this.globals.url + this.uri + '/' + id, JSON.stringify(module));
  }
}
