import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
/*import 'rxjs/Rx';*/
import 'rxjs/add/operator/map';
import {Globals} from '../_common/globals';
import {Source} from '../_models/Source.model';

@Injectable()
export class SourceService {

  public uri = '/admin/sources';

  /* headers;*/

  constructor(private http: Http,
              private globals: Globals) {}

  getSources(search = {}): Observable<Source[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().sources
      );
  }

  create(source: Source): Observable<Response> {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(source));
  }

  update(source: Source): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + source.id, JSON.stringify(source));
  }

  delete(source: Source | number): Observable<Response> {
    const id = typeof source === 'number' ? source : source.id;
    return this.http.post(this.globals.url + this.uri + '/' + id, JSON.stringify(source));
  }
}
