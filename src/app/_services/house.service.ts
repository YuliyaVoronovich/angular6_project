import {Http, Response} from '@angular/http';
import {Globals} from '../_common/globals';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Count} from '../_models/Count.model';
import {Observable} from 'rxjs/index';
import {House} from '../_models/House.model';

@Injectable()
export class HouseService {

  private uri = '/houses';
  private uri_archive = '/archive/houses';


  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }

  getHouses(search = {}): Observable<House[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().houses
      );
  }

  countHouses(search = {}): Observable<Count> {
    return this.http.get(this.globals.url + this.uri + '/count', {search: search})
      .map((response: Response) => response.json()
      );
  }

  getHouse(id) {
    return this.http.get(this.globals.url + this.uri + '/house/' + id)
      .map((response: Response) => response.json());
  }

  create(house: House) {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(house))
      .map((response: Response) => response.json());
  }

  update(house: House) {
    return this.http.put(this.globals.url + this.uri + '/' + house.id, JSON.stringify(house))
      .map((response: Response) => response.json());
  }

  delete(house: House | number): Observable<Response> {
    const id = typeof house === 'number' ? house : house.id;
    return this.http.post(this.globals.url + this.uri + '/' + id, JSON.stringify(house));
  }
  newLocationRequest(request) {
    return this.http.post(this.globals.url + this.uri + '/new_location_request', JSON.stringify(request));
  }

  /*Архив*/
  getHousesArchive(search = {}): Observable<House[]> {
    return this.http.get(this.globals.url + this.uri_archive, {search: search})
      .map((response: Response) => response.json().houses
      );
  }
  countHousesArchive(search = {}): Observable<Count> {
    return this.http.get(this.globals.url + this.uri_archive + '/count', {search: search})
      .map((response: Response) => response.json()
      );
  }
  restoreHouse(house: House) {
    return this.http.put(this.globals.url + this.uri_archive + '/restore/' + house.id, JSON.stringify(house))
      .map((response: Response) => response.json()
      );
  }
  /*Архив*/

}
