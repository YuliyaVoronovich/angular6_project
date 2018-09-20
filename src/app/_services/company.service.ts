import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import {Company} from '../_models/company.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {Globals} from '../_common/globals';

@Injectable()
export class CompanyService {

  private uri = '/admin/companies';

  constructor(private http: Http,
              private globals: Globals) {
  }

  getCompanies(search = {}): Observable<Company[]> {

    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().companies);
    // .catch(this.handleError);
  }

  getCompany(id) {

    return this.http.get(this.globals.url + this.uri + '/company/' + id)
      .map((response: Response) => response.json());
  }

  setCompany(company: Company) {
    if (!company) {
      return company = new Company(null, '', '', '', '', '', null, null, '',
        '', '', null, null, null, [], null, false, null);
    }
    return company;
  }

  create(company: Company): Observable<Response> {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(company));
  }

  update(company: Company): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + company.id, JSON.stringify(company));
  }

  block(company: Company | number): Observable<Response> {
    const id = typeof company === 'number' ? company : company.id;
    return this.http.post(this.globals.url + '/block/' + this.uri + '/' + id, JSON.stringify(company));
  }
  unblock(company: Company | number): Observable<Response> {
    const id = typeof company === 'number' ? company : company.id;
    return this.http.post(this.globals.url + '/unblock/' + id, JSON.stringify(company));
  }



  private handleError(error: Response) {
    console.log(error.statusText);
    return Observable.throw(error.statusText);
  }
}
