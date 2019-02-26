import {Http, Response} from '@angular/http';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {Globals} from '../_common/globals';
import {Observable} from 'rxjs/index';
import {Site} from '../_models/Site';

@Injectable()
export class SiteService {

  private uri = '/admin/sites';


  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }

  getSites(search = {}): Observable<Site[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().sites);
  }

  create(site: Site): Observable<Response> {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(site));
  }

  update(site: Site): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + site.id, JSON.stringify(site));
  }

}
