import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
/*import 'rxjs/Rx';*/
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Sale} from '../_models/sale.model';
import {Count} from '../_models/count.model';
import {Globals} from '../_common/globals';


@Injectable()
export class SaleService {

  private uri = '/sales';


  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }


  getSales(search = {}): Observable<Sale[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().sales
      );
  }

  countSales(search = {}): Observable<Count> {
    return this.http.get(this.globals.url + this.uri + '/count', {search: search})
      .map((response: Response) => response.json()
      );
  }

  getSale(id) {
    return this.http.get(this.globals.url + this.uri + '/sale/' + id)
      .map((response: Response) => response.json());
  }

  create(sale: Sale): Observable<Response> {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(sale));
  }

  update(sale: Sale): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + sale.id, JSON.stringify(sale));
  }

  delete(sale: Sale | number): Observable<Response> {
    const id = typeof sale === 'number' ? sale : sale.id;
    return this.http.post(this.globals.url + this.uri + '/' + id, JSON.stringify(sale));
  }

}
