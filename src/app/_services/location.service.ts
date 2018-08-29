import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import {Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent} from 'rxjs';
/*import 'rxjs/Rx';*/
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Location} from '../_models/location.model';
import {City} from '../_models/city.model';
import {District} from '../_models/district.model';
import {Region} from '../_models/region.model';
import {Metro} from '../_models/metro.model';
import {DistrictCountry} from '../_models/district_country.model';
import {Street} from '../_models/street.model';
import {Microdistrict} from '../_models/microdistrict.model';
import {Globals} from '../_common/globals';

@Injectable()
export class LocationService {

  private uri = '/locations';

  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }

  // получение всех массивов
  getAllLocations() {
    return this.http.get(this.globals.url + this.uri + '/all')
      .map((response: Response) => response.json());
  }

  getLocations(search = {}): Observable<Location[]>  {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().locations);
  }

  getLocation(search = {}): Observable<Location>  {
    return this.http.get(this.globals.url + this.uri + '/location', {search: search})
      .map((response: Response) => response.json().location);
  }

  getRegions() {
    return this.http.get(this.globals.url + this.uri + '/regions')
      .map((response: Response) => response.json().regions);
    // .catch(this.handleError);
  }

  getDistrictsRb(region = 0) {
    return this.http.get(this.globals.url + this.uri + '/districts_rb', {search: {'region': region}})
      .map((response: Response) => response.json().districts_rb);
    // .catch(this.handleError);
  }

  getCities(region = 0, district = 0) {
    return this.http.get(this.globals.url + this.uri + '/cities', {search: {'region': region, 'district': district}})
      .map((response: Response) => response.json().cities);
    // .catch(this.handleError);
  }

  getStreets(city) {
    return this.http.get(this.globals.url + this.uri + '/streets', {search: {'city': city}})
      .map((response: Response) => response.json().streets);
    // .catch(this.handleError);
  }

  setCity(location: Location): City {
    if (!location.city) {
      return location.city = new City(0, null, '');
    }
    return location.city;
  }

  setDistrict(location: Location): District {
    if (!location.district) {
      return location.district = new District(0, null, '', '');
    }
    return location.district;
  }

  setMicroDistrict(location: Location): Microdistrict {
    if (!location.microdistrict) {
      return location.microdistrict = new Microdistrict(0, null, '', '');
    }
    return location.microdistrict;
  }

  setStreet(location: Location): Street {
    if (!location.street) {
      return location.street = new Street(0, '', null);
    }
    return location.street;
  }

  setMetro(location: Location): Metro {
    if (!location.metro) {
      return location.metro = new Metro(0, 0, '');
    }
    return location.metro;
  }

  setDistrictCountry(location: Location): DistrictCountry {
    if (!location.city.district_country) {
      return location.city.district_country = new DistrictCountry(0, null, '');
    }
    return location.city.district_country;
  }

  setRegion(location: Location): Region {
    if (!location.city.district_country.region) {
      return location.city.district_country.region = new Region(0, null);
    }
    return location.city.district_country.region;
  }

  setLocation(location: Location): Location {
    if (!location) {
      return location = new Location(0, null, null, null, null, null, null, '', '', null, '', 0, 0, 0, 0, '');
    }
    return location;
  }

  create(location: Location): Observable<Response> {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(location));
  }

  update(location: Location): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + location.id, JSON.stringify(location));
  }
}
