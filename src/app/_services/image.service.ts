import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import 'rxjs/add/operator/map';
import {Globals} from '../_common/globals';

@Injectable()
export class ImageService {

  public uri = '/images';


  constructor(private http: Http,
              private globals: Globals) {
  }

  delete(path: string): Observable<Response> {
    return this.http.post(this.globals.url + this.uri + '/delete', JSON.stringify({'path': path}));
  }

}
