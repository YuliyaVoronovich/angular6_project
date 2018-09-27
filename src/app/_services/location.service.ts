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
import {DistrictCountry} from '../_models/districtCountry.model';
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
  getDistricts(city = 0) {
    return this.http.get(this.globals.url + this.uri + '/districts', {search: {'city': city}})
      .map((response: Response) => response.json().districts);
    // .catch(this.handleError);
  }
  getMicroDistricts(district = 0) {
    return this.http.get(this.globals.url + this.uri + '/microdistricts', {search: {'district': district}})
      .map((response: Response) => response.json().microdistricts);
    // .catch(this.handleError);
  }

  getStreets(city, microdistrict) {
    return this.http.get(this.globals.url + this.uri + '/streets', {search: {'city': city, 'microdistrict': microdistrict}})
      .map((response: Response) => response.json().streets);
    // .catch(this.handleError);
  }

  setCity(city: City): City {
    if (!city) {
      return city = new City(0, null, '');
    }
    return city;
  }

  setDistrict(district: District): District {
    if (!district) {
      return district = new District(0, null, '', '');
    }
    return district;
  }

  setMicroDistrict(microdistrict: Microdistrict): Microdistrict {
    if (!microdistrict) {
      return microdistrict = new Microdistrict(0, null, '', '');
    }
    return microdistrict;
  }

  setStreet(street: Street): Street {
    if (!street) {
      return street = new Street(0, '', null);
    }
    return street;
  }

  setMetro(metro: Metro): Metro {
    if (!metro) {
      return metro = new Metro(0, 0, '');
    }
    return metro;
  }

  setDistrictCountry(district_country: DistrictCountry): DistrictCountry {
    if (!district_country) {
      return district_country = new DistrictCountry(0, null, '');
    }
    return district_country;
  }

  setRegion(region: Region): Region {
    if (!region) {
      return region = new Region(0, null);
    }
    return region;
  }

  setLocation(location: Location): Location {
    if (!location) {
      return location = new Location(0, null, null, null, null, null, null, '', '', null, '', 0, 0, 0, 0, '');
    }
    return location;
  }

  create(location: Location) {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(location))
      .map((response: Response) => response.json().location
    );
  }

  update(location: Location): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + location.id, JSON.stringify(location));
  }
}
