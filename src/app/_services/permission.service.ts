import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import 'rxjs/add/operator/map';
import {Globals} from '../_common/globals';

@Injectable()
export class PermissionService {

  public uri = '/permissions';


  constructor(private http: Http,
              private globals: Globals) {
  }


}
