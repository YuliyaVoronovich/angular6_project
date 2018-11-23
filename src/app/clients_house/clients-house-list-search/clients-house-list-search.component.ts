import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IOption} from 'ng-select';
import {LocationService} from '../../_services/location.service';
import {LabelService} from '../../_services/label.service';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {SearchClientHouseModel} from '../../_models/SearchClientHouse.model';
import {Label} from '../../_models/Label.model';

@Component({
  selector: 'app-clients-house-list-search',
  templateUrl: './clients-house-list-search.component.html',
  styleUrls: ['./clients-house-list-search.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ClientsHouseListSearchComponent implements OnInit {

  @Output() changed = new EventEmitter();

  public regions: Array<IOption> = [
    {label: '', value: ''}
  ];

  public districts_rb: Array<IOption> = [
    {label: '', value: ''}
  ];

  public cities: Array<IOption> = [
    {label: '', value: ''}
  ];

  public districts: Array<IOption> = [
    {label: '', value: ''}
  ];

  public directions: Array<IOption> = [
    {label: '', value: ''}
  ];

  public types: Label[] = [];
  public arrayTypes = [];

  public search = new SearchClientHouseModel({'values': []}, {'values': []}, {'values': []},
    {'values': []}, {'values': []}, '', [], 0, null, null,
    null, null, false);

  public citiesSelected = [];
  public citiesSearch = '';

  public hide = false;

  constructor(private locationService: LocationService,
              private labelsService: LabelService) { }

  ngOnInit() {
    this.getRegions();
    this.getDistrictsRb();
    this.getCities();
    this.getDistricts();
    this.getDirections();
    this.getLabels();
  }

  searchClients() {
    this.changed.emit(this.search);
  }

  clear() {
    this.search = new SearchClientHouseModel({'values': []}, {'values': []}, {'values': []},
      {'values': []}, {'values': []}, '', [], 0, null, null,
      null, null, false);

  }

  getRegions() {
    this.locationService.getRegions().subscribe((options) => {
      this.regions = [];

      for (let i = 0; i < options.length; i++) {
        this.regions.push({label: options[i].title, value: '' + options[i].id});
      }
    });

  }

  getDistrictsRb(region: any = 0) {
    this.locationService.getDistrictsRb(region).subscribe((options) => {
      this.districts_rb = [];

      for (let i = 0; i < options.length; i++) {
        this.districts_rb.push({label: options[i].title, value: '' + options[i].id});

      }
    });
  }

  getCities(region: any = 0, district_rb: any = 0) {
    this.locationService.getCities(region, district_rb).subscribe((options) => {
      this.cities = [];

      for (let i = 0; i < options.length; i++) {
        this.cities.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getDistricts(city: any = 0) {
    this.locationService.getDistricts(city).subscribe((options) => {
      this.districts = [];

      for (let i = 0; i < options.length; i++) {
        this.districts.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getDirections() {
    this.locationService.getDirections().subscribe((options) => {
      this.directions = [];

      for (let i = 0; i < options.length; i++) {
        this.directions.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getLabels() {
    this.labelsService.getAllLabelsHouses().subscribe(data => {
      this.types = data.types;
    });
  }

  selectDistrictsRb(option: IOption) {
    this.getDistrictsRb(`${option.value}`);
  }

  selectCities(option: IOption) {
    this.getCities(0, `${option.value}`);
  }

  selectDistrict(option: IOption) {
    this.citiesSelected.push(`${option.value}`);
    this.citiesSearch = JSON.stringify(this.citiesSelected);
    this.getDistricts(this.citiesSearch);
  }

  deselectDistrict(option: IOption) {
    const index: number = this.citiesSelected.indexOf(`${option.value}`);
    if (index !== -1) {
      this.citiesSelected.splice(index, 1);
    }
    this.citiesSearch = JSON.stringify(this.citiesSelected);
    this.getDistricts(this.citiesSearch);
  }

  typesTrigger(event) {
    if (this.arrayTypes[event]) {
      const index: number = this.search.types.indexOf(event);
      if (index !== -1) {
        this.search.types.splice(index, 1);
      }
    } else {
      this.search.types.push(event);
    }
  }

}
