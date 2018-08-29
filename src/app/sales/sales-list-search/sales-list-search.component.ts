import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IOption} from 'ng-select';
import {LocationService} from '../../_services/location.service';

@Component({
  selector: 'app-sales-list-search',
  templateUrl: './sales-list-search.component.html',
  styleUrls: ['./sales-list-search.component.css']
})
export class SalesListSearchComponent implements OnInit {

  @Output() changed = new EventEmitter();

  public regions: Array<IOption> = [
    {label: '', value: ''}
  ];

  public cities: Array<IOption> = [
    {label: '', value: ''}
  ];

  public streets: Array<IOption> = [
    {label: '', value: ''}
  ];

  public hide = false;

  public search = {
    'region' : '',
    'city': '',
    'street': '',
    'room': [],
    'price': ''
  };

  constructor( private locationService: LocationService) { }

  ngOnInit() {
    this.getRegions();
    this.getCities();
    this.getStreets();
  }

  searchSale() {
    this.changed.emit(this.search);
  }

  getRegions() {
    this.locationService.getRegions().subscribe((options) => {
      this.regions = [];
      for (let i = 0; i < options.length; i++) {
        this.regions.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getCities(region = 0) {
    this.locationService.getCities(region).subscribe((options) => {
      this.cities = [];
      for (let i = 0; i < options.length; i++) {
        this.cities.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getStreets(city = 0) {
    this.locationService.getStreets(city).subscribe((options) => {
      this.streets = [];
      for (let i = 0; i < options.length; i++) {
        this.streets.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }


}
