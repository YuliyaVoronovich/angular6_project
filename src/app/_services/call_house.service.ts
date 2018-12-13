import {Http, Response} from '@angular/http';
import {Globals} from '../_common/globals';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class CallHouse {

  private uri = '/calls_house';


  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }

}
