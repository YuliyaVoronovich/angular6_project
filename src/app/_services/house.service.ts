import {Http, Response} from '@angular/http';
import {Globals} from '../_common/globals';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Count} from '../_models/Count.model';
import {Observable} from 'rxjs/index';
import {House} from '../_models/House.model';
import {HouseAdditionInformation} from '../_models/HouseAdditionInformation.model';
import {Sale} from "../_models/Sale.model";

@Injectable()
export class HouseService {

  private uri = '/houses';
  private uri_archive = '/houses/archive';
  private uri_moderation = '/houses/moderation';
  private uri_delete = '/houses/delete';


  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }
  setHouse(house: House) {
    if (!house) {
      return house = new House(0, null, null,  [],'', '', '', '',  '', null, null, false,
        '', 0, 0, false, false, false, false, 0, '', null, '',
        '', 0, null, 0, 0, 0, 0, 0, 0, 0, 0, null, 0, false, false,
        false, '', 0, 0, 0, 0, 0, 0, false, '', '', '', null, false, false,
        false, null, null, null,   null, false, false, false, false);
    }
    return house;
  }

  setHouseAdditionInformation(house_addition_information: HouseAdditionInformation) {
    if (!house_addition_information) {
      return house_addition_information = new HouseAdditionInformation(0, false
        , false, false, false, false, false, false, false, false, false, false
        , false, false, false, false, false, false, false, false, false, false);
    }
    return house_addition_information;
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

  showHouse(id) {
    return this.http.get(this.globals.url + this.uri + '/house/show/' + id)
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

  delete(house: House | number) {
    const id = typeof house === 'number' ? house : house.id;
    return this.http.post(this.globals.url + this.uri + '/' + id, JSON.stringify(house))
      .map((response: Response) => response.json());
  }

  saveReclame(house: House | number): Observable<Response> {
    const id = typeof house === 'number' ? house : house.id;
    return this.http.post(this.globals.url + this.uri + '/save_reclame/' + id, JSON.stringify(house));
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

  /*Модерация*/
  getHousesModeration(search = {}): Observable<House[]> {
    return this.http.get(this.globals.url + this.uri_moderation, {search: search})
      .map((response: Response) => response.json().houses
      );
  }
  countHousesModeration(search = {}): Observable<Count> {
    return this.http.get(this.globals.url + this.uri_moderation + '/count', {search: search})
      .map((response: Response) => response.json()
      );
  }
  returnModeration(house: House) {
    return this.http.put(this.globals.url + this.uri_moderation + '/' + house.id, JSON.stringify(house))
      .map((response: Response) => response.json()
      );
  }
  /*Модерация*/

  /*Удаленные*/
  getHousesDelete(search = {}): Observable<House[]> {
    return this.http.get(this.globals.url + this.uri_delete, {search: search})
      .map((response: Response) => response.json().houses
      );
  }
  countHousesDelete(search = {}): Observable<Count> {
    return this.http.get(this.globals.url + this.uri_delete + '/count', {search: search})
      .map((response: Response) => response.json()
      );
  }
  returnDelete(house: House) {
    return this.http.put(this.globals.url + this.uri_delete + '/' + house.id, JSON.stringify(house))
      .map((response: Response) => response.json()
      );
  }

  archiveDelete(house: House | number): Observable<Response> {
    const id = typeof house === 'number' ? house : house.id;
    return this.http.post(this.globals.url + this.uri_delete + '/' + id, JSON.stringify(house));
  }
  /*Удаленные*/

  /*отправка на реалт*/
  sendRealt(house: House) {
    return this.http.put(this.globals.url + '/realt_house_add/' + house.id, JSON.stringify(house));
  }

  /*удаление с реалта*/
  deleteRealt(house: House) {
    return this.http.post(this.globals.url + '/realt_house_delete/' + house.id, JSON.stringify(house));
  }

}
