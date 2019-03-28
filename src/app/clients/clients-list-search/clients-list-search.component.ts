import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IOption} from 'ng-select';
import {LocationService} from '../../_services/location.service';
import {LabelService} from '../../_services/label.service';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {SearchClientModel} from '../../_models/SearchClient.model';

@Component({
  selector: 'app-clients-list-search',
  templateUrl: './clients-list-search.component.html',
  styleUrls: ['./clients-list-search.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ClientsListSearchComponent implements OnInit {

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
  public cities_remember: Array<IOption> = [
    {label: '', value: ''}
  ];

  public districts: Array<IOption> = [
    {label: '', value: ''}
  ];

  public search = new SearchClientModel('', '', {'values': []},
    {'values': []}, '', '', null, null, null,
    null, false);

  public citiesSelected = [];
  public citiesSearch = '';
  public districtsRbSearch = '';

  public hide = false;

  constructor(private locationService: LocationService,
              private labelsService: LabelService) { }

  ngOnInit() {
    this.getRegions();
    this.getDistrictsRb();
    this.getCitiesInitializate();
    this.getDistricts();
  }

  searchClients() {
    this.changed.emit(this.search);
  }

  clear() {
  this.search = new SearchClientModel(0, 0, {'values': []},
      {'values': []}, '', '', null, null, null,
      null, false);

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

  getCitiesInitializate() {
    this.cities = [];
    this.cities_remember = [];
  }

  getCities (region: any = 0, district_rb: any = 0, title = '') {

    /* добавить в массив по фильтру более 2 символов*/
    if (title.length > 2) {
      this.locationService.getCities(region, district_rb, title).subscribe((options) => {
        this.cities = [];

        /* добавить уже выбранные в массив*/
        for (let i = 0; i < this.cities_remember.length; i++) {
          this.cities.push({label: this.cities_remember[i].label, value: '' + this.cities_remember[i].value});
        }

        for (let i = 0; i < options.length; i++) {
          this.cities.push({label: options[i].title, value: '' + options[i].id});
        }
      });
    } else {
      this.cities = [];
    }
  }

  getDistricts(city: any = 0) {
    this.locationService.getDistricts(city).subscribe((options) => {
      this.districts = [];

      for (let i = 0; i < options.length; i++) {
        this.districts.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  selectDistrictsRb(option: IOption) {
    this.getDistrictsRb(`${option.value}`);
  }

  selectCities(option: IOption) {
    this.districtsRbSearch = `${option.value}`;
  //  this.getCities(0, `${option.value}`);
  }

  selectDistrict(option: IOption) {
    this.cities_remember.push({label: `${option.label}`, value: '' + `${option.value}`}); // добавить выбранный город в массив, чтобы не потерялся при выборе следующего

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

}
