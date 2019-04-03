import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import {Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent} from 'rxjs';
/*import 'rxjs/Rx';*/
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Location} from '../_models/Location.model';
import {City} from '../_models/City.model';
import {District} from '../_models/District.model';
import {Region} from '../_models/Region.model';
import {Metro} from '../_models/Metro.model';
import {DistrictCountry} from '../_models/DistrictCountry.model';
import {Street} from '../_models/Street.model';
import {Microdistrict} from '../_models/Microdistrict.model';
import {Globals} from '../_common/globals';
import {Direction} from '../_models/Direction.model';

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

  getLocations(search = {}): Observable<Location[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().locations);
  }

  getLocation(search = {}): Observable<Location> {
    return this.http.get(this.globals.url + this.uri + '/location', {search: search})
      .map((response: Response) => response.json().location);
  }

  getRegions() {
    return this.http.get(this.globals.url + this.uri + '/regions')
      .map((response: Response) => response.json().regions);
  }

  getDistrictsRb(region = 0) {
    return this.http.get(this.globals.url + this.uri + '/districts_rb', {search: {'region': region}})
      .map((response: Response) => response.json().districts_rb);
  }

  getCities(region = 0, district = 0, title = '') {
    return this.http.get(this.globals.url + this.uri + '/cities', {search: {'region': region, 'district': district, 'title': title}})
      .map((response: Response) => response.json().cities);
  }

  getDistricts(city = 0) {
    return this.http.get(this.globals.url + this.uri + '/districts', {search: {'city': city}})
      .map((response: Response) => response.json().districts);
  }

  getMicroDistricts(city = 0, district = 0) {
    return this.http.get(this.globals.url + this.uri + '/microdistricts', {
      search: {
        'city': city,
        'district': district
      }
    })
      .map((response: Response) => response.json().microdistricts);
  }

  getStreets(city = 0, district = 0, microdistrict = 0, title = '') {
    return this.http.get(this.globals.url + this.uri + '/streets', {
      search: {
        'city': city,
        'district': district,
        'microdistrict': microdistrict,
        'title': title
      }
    })
      .map((response: Response) => response.json().streets);
  }

  getDirections() {
    return this.http.get(this.globals.url + this.uri + '/directions')
      .map((response: Response) => response.json().directions);
  }

  rotateCoordinates(coordinates) {
    let rotate_coordinates = [];
    if (coordinates) {
      rotate_coordinates = coordinates.split(',');
    }
    return rotate_coordinates;
  }

  setCity(city: City): City {
    if (!city) {
      return city = new City(0, null, '');
    }
    return city;
  }

  setDistrict(district: District): District {
    if (!district) {
      return district = new District(0, null, '', '', '');
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

  setDirection(direction: Direction): Direction {
    if (!direction) {
      return direction = new Direction(0, '', '');
    }
    return direction;
  }

  setLocation(location: Location): Location {
    if (!location) {
      return location = new Location(0, null, null, null, null, null, null, '', '', null, '', null, null, 0, 0, null, '');
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
