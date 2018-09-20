import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/index';
import {Request} from '../_models/request.model';
import {Globals} from '../_common/globals';

@Injectable()
export class RequestService {

  public uri = '/admin/requests';
  public section_location = 1;

  constructor(private http: Http,
              private globals: Globals) {
  }

  getRequests(search = {}): Observable<Request[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().requests
      );
  }
  getRequest(id) {
    return this.http.get(this.globals.url + this.uri + '/request/' + id)
      .map((response: Response) => response.json());
  }

  /*sendRequest() {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(this.section_location));
  }*/

  deleteRequest(request: Request | number) {
    const id = typeof request === 'number' ? request : request.id;
    return this.http.post(this.globals.url + this.uri + '/' + id, JSON.stringify(request));
  }

}
