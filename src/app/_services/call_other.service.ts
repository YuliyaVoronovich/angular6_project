import {Http, Response} from '@angular/http';
import {Globals} from '../_common/globals';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {Count} from '../_models/Count.model';
import {Observable} from 'rxjs/index';
import {CallOther} from '../_models/CallOther';

@Injectable()
export class CallOtherService {

  private uri = '/calls_other';


  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }

  getCalls(search = {}): Observable<CallOther[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().calls);
  }

  countCalls(search = {}): Observable<Count> {
    return this.http.get(this.globals.url + this.uri + '/count', {search: search})
      .map((response: Response) => response.json()
      );
  }

  getCall(id) {
    return this.http.get(this.globals.url + this.uri + '/call/' + id)
      .map((response: Response) => response.json());
  }

  update(call: CallOther) {
    return this.http.put(this.globals.url + this.uri + '/' + call.id, JSON.stringify(call))
      .map((response: Response) => response.json()
      );
  }
}
