import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import {Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent} from 'rxjs';
/*import 'rxjs/Rx';*/
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Sale} from '../_models/Sale.model';
import {Count} from '../_models/Count.model';
import {Globals} from '../_common/globals';
import {SaleAdditionInformation} from '../_models/SaleAdditionInformation.model';


@Injectable()
export class SaleService {

  private uri = '/sales';
  private uri_archive = '/sales/archive';
  private uri_moderation = '/sales/moderation';
  private uri_delete = '/sales/delete';


  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }
  setSale(sale: Sale) {
    if (!sale) {
      return sale = new Sale(0, null, null, '', '', '', 0, 0, false,
        '', false, false, false, '', '', null, null,  false, '', null,
        '', 0, 0, 0, 0, 0, 0, '', 0, 0, 0, false, false, false, 0,
        0, 0,  0, 0, '', 0, false, '', '', false, 0, 0, null,
        null, null, null,  false, false, false, null, null, null,
        null, false, false, false, false);
    }
    return sale;
  }

  setSaleAdditionInformation(sale_addition_information: SaleAdditionInformation) {
    if (!sale_addition_information) {
      return sale_addition_information = new SaleAdditionInformation(0, false
        , false, false, false, false, false, false, false, false, false, false
        , false, false, false, false, false, false, false, false, false, false
        , false, false, false, false, false, false, false);
    }
    return sale_addition_information;
  }

  getSales(search = {}): Observable<Sale[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().sales);
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

  delete(sale: Sale | number) {
    const id = typeof sale === 'number' ? sale : sale.id;
    return this.http.post(this.globals.url + this.uri + '/' + id, JSON.stringify(sale))
      .map((response: Response) => response.json());
  }

  saveReclame(sale: Sale | number): Observable<Response> {
    const id = typeof sale === 'number' ? sale : sale.id;
    return this.http.post(this.globals.url + this.uri + '/save_reclame/' + id, JSON.stringify(sale));
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

  /*Модерация*/
  getSalesModeration(search = {}): Observable<Sale[]> {
    return this.http.get(this.globals.url + this.uri_moderation, {search: search})
      .map((response: Response) => response.json().sales
      );
  }
  countSalesModeration(search = {}): Observable<Count> {
    return this.http.get(this.globals.url + this.uri_moderation + '/count', {search: search})
      .map((response: Response) => response.json()
      );
  }
  returnModeration(sale: Sale) {
    return this.http.put(this.globals.url + this.uri_moderation + '/' + sale.id, JSON.stringify(sale))
      .map((response: Response) => response.json()
      );
  }
  /*Модерация*/

  /*Удаленные*/
  getSalesDelete(search = {}): Observable<Sale[]> {
    return this.http.get(this.globals.url + this.uri_delete, {search: search})
      .map((response: Response) => response.json().sales
      );
  }
  countSalesDelete(search = {}): Observable<Count> {
    return this.http.get(this.globals.url + this.uri_delete + '/count', {search: search})
      .map((response: Response) => response.json()
      );
  }
  returnDelete(sale: Sale) {
    return this.http.put(this.globals.url + this.uri_delete + '/' + sale.id, JSON.stringify(sale))
      .map((response: Response) => response.json()
      );
  }

  archiveDelete(sale: Sale | number): Observable<Response> {
    const id = typeof sale === 'number' ? sale : sale.id;
    return this.http.post(this.globals.url + this.uri_delete + '/' + id, JSON.stringify(sale));
  }
  /*Удаленные*/

}
