import { Injectable } from '@angular/core';
import {CsAgreement} from '../_models/CsAgreement.model';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {LoginService} from './login.service';
import {Router} from '@angular/router';
import {Globals} from '../_common/globals';

@Injectable()
export class AgreementService {

  private uri = '/agreements';


  constructor(private http: Http,
              private route: Router,
              private globals: Globals) {
  }

  getCsAgreements(search = {}): Observable<CsAgreement[]> {

    return this.http.get(this.globals.url + this.uri + '/cs/', {search: search})
      .map((response: Response) => response.json().agreements);
  }


}
