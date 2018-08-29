import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/index';
import {Request} from '../_models/request.model';
import {Globals} from '../_common/globals';

@Injectable()
export class RequestService {

  public uri = '/admin/requests';

  constructor(private http: Http,
              private globals: Globals) {
  }

  getRequests(search = {}): Observable<Request[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().requests
      );
  }
  sendRequest() {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(1));
  }

}
