import {Http, Response} from '@angular/http';
import {Globals} from '../_common/globals';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class Call {

  private uri = '/calls';


  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }

}
