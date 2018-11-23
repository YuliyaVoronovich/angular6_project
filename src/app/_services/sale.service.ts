import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import {Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent} from 'rxjs';
/*import 'rxjs/Rx';*/
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Sale} from '../_models/Sale.model';
import {Count} from '../_models/Count.model';
import {Globals} from '../_common/globals';


@Injectable()
export class SaleService {

  private uri = '/sales';
  private uri_archive = '/archive/sales';


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

  create(sale: Sale) {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(sale))
      .map((response: Response) => response.json()
      );
  }

  update(sale: Sale) {
    return this.http.put(this.globals.url + this.uri + '/' + sale.id, JSON.stringify(sale))
      .map((response: Response) => response.json()
      );
  }

  delete(sale: Sale | number): Observable<Response> {
    const id = typeof sale === 'number' ? sale : sale.id;
    return this.http.post(this.globals.url + this.uri + '/' + id, JSON.stringify(sale));
  }

  newLocationRequest(request): Observable<Response> {
    return this.http.post(this.globals.url + this.uri + '/new_location_request', JSON.stringify(request));
  }

  /*Архив*/
  getSalesArchive(search = {}): Observable<Sale[]> {
    return this.http.get(this.globals.url + this.uri_archive, {search: search})
      .map((response: Response) => response.json().sales
      );
  }
  countSalesArchive(search = {}): Observable<Count> {
    return this.http.get(this.globals.url + this.uri_archive + '/count', {search: search})
      .map((response: Response) => response.json()
      );
  }
  deleteArchive(sale: Sale | number): Observable<Response> {
    const id = typeof sale === 'number' ? sale : sale.id;
    return this.http.post(this.globals.url + this.uri_archive + '/' + id, JSON.stringify(sale));
  }
  restoreSale(sale: Sale) {
    return this.http.put(this.globals.url + this.uri_archive + '/restore/' + sale.id, JSON.stringify(sale))
      .map((response: Response) => response.json()
      );
  }
  /*Архив*/

}
