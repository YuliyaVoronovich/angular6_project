import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import {Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent} from 'rxjs';
import {Company} from '../_models/Company.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {Globals} from '../_common/globals';
import {CompanyInformation} from '../_models/CompanyInformation.model';

@Injectable()
export class CompanyService {

  public uri = '/companies';
  public admin_uri = '/admin/companies';
  public path = '';

  constructor(private http: Http,
              private globals: Globals) {
    this.getPathUrl();
  }

  getPathUrl() {
    const location = window.location.pathname;
    location.split('/').forEach(element => {
      if (element !== '' && this.path === '') {
        this.path = element;
      }
    });
    if (this.path === 'admin') {
      this.uri = this.admin_uri;
    }
    // console.log('route: ' + this.uri); // Root path
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
        '', '', null, null, null, [], null, false, [], null);
    }
    return company;
  }

  setCompanyInformation(company_information: CompanyInformation) {
    if (!company_information) {
      return company_information = new CompanyInformation(null, null, '', '', '', '', '', null, null, '',
        '', false, false, false, false, false, null, '', '',
        '', false, '', '', '', '', '', false, '',
        '', '', '', false, false, false, false, false,
        false, false, false, false, false, false, false, false,  '', '', '',
        '', '', '', '', '');
    }
    return company_information;
  }

  create(company: Company): Observable<Response> {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(company));
  }

  update(company: Company): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + company.id, JSON.stringify(company));
  }

  block(company: Company | number): Observable<Response> {
    const id = typeof company === 'number' ? company : company.id;
    return this.http.post(this.globals.url + this.uri + '/block/' + id, JSON.stringify(company));
  }

  unblock(company: Company | number): Observable<Response> {
    const id = typeof company === 'number' ? company : company.id;
    return this.http.post(this.globals.url + this.uri + '/unblock/' + id, JSON.stringify(company));
  }


  private handleError(error: Response) {
    console.log(error.statusText);
    return Observable.throw(error.statusText);
  }
}
