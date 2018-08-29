import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
/*import 'rxjs/Rx';*/
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Globals} from '../_common/globals';

@Injectable()
export class LabelService {

  private uri = '/labels';

  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }

  getAllLabels() {
    return this.http.get(this.globals.url + this.uri)
      .map((response: Response) => response.json());
  }

}
