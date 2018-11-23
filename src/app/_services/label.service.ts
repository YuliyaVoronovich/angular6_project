import {Injectable} from '@angular/core';
import {Response, Http, Headers} from '@angular/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
/*import 'rxjs/Rx';*/
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Globals} from '../_common/globals';
import {Label} from '../_models/Label.model';

@Injectable()
export class LabelService {

  private uri = '/labels';

  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }

  getAllLabelsSales() {
    return this.http.get(this.globals.url + this.uri + '/sales')
      .map((response: Response) => response.json());
  }

  getAllLabelsHouses() {
    return this.http.get(this.globals.url + this.uri + '/houses')
      .map((response: Response) => response.json());
  }

  setTypeHouse(type_house: Label): Label {
    if (!type_house) {
      return type_house = new Label(0, '', '', '','');
    }
    return type_house;
  }

  setRoofHouse(roof_house: Label): Label {
    if (!roof_house) {
      return roof_house = new Label(0, '', '', '', '');
    }
    return roof_house;
  }

}
