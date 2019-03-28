import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LabelService} from '../../_services/label.service';
import {CompanyService} from '../../_services/company.service';
import {LocationService} from '../../_services/location.service';
import {IOption} from 'ng-select';
import {Company} from '../../_models/Company.model';
import {SearchHouseModel} from '../../_models/SearchHouse.model';
import {Label} from '../../_models/Label.model';

@Component({
  selector: 'app-houses-list-search',
  templateUrl: './houses-list-search.component.html',
  styleUrls: ['./houses-list-search.component.css']
})
export class HousesListSearchComponent implements OnInit {

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

  public streets: Array<IOption> = [
    {label: '', value: ''}
  ];

  public streets_remember: Array<IOption> = [
    {label: '', value: ''}
  ];

  public directions: Array<IOption> = [
    {label: '', value: ''}
  ];

  public regionsSelected = [];
  public regionsSearch = '';
  public districtsRbSelected = [];
  public districtsRbSearch = '';
  public citiesSelected = [];
  public citiesSearch = '';
  public districtsSelected = [];
  public districtsSearch = '';

  public hide = false;
  public hide_wall = false;
  public hide_roof = false;
  public hide_sale = false;
  public hide_repair = false;
  public hide_heating = false;
  public hide_water = false;
  public hide_sewage = false;

  public types: Label[] = [];
  public walls: Label[] = [];
  public roofs: Label[] = [];
  public sales: Label[] = [];
  public repairs: Label[] = [];
  public heating: Label[] = [];
  public sewage: Label[] = [];
  public water: Label[] = [];

  public companies: Company[] = [];

  public arrayTypes = [];
  public arrayWalls = [];
  public arrayRoofs = [];
  public arraySales = [];
  public arrayRepairs = [];
  public arrayHeating = [];
  public arraySewage = [];
  public arrayWater = [];

  public search = new SearchHouseModel({'values': [], 'except': 0}, {'values': [], 'except': 0},
    {'values': [], 'except': 0}, {'values': [], 'except': 0}, {'values': [], 'except': 0},
    {'values': [], 'except': 0}, '', null, null, null, null,
    '', '', '', '', '', '', '', '',
    '', '', [], [], [], [], '', '', [], [],
    [], [],  false, false, false, false, false, false, false);

  constructor(private locationService: LocationService,
              private labelsService: LabelService,
              private companyService: CompanyService
  ) {
  }

  ngOnInit() {
    this.getRegions();
    this.getDistrictsRb();
    this.getCitiesInitializate();
    this.getDistricts();
    this.getStreetsInitializate();
    this.getDirections();
    this.getLabels();
    this.getCompanies();
  }

  searchHouses() {
    this.changed.emit(this.search);
  }

  clear() {
    this.search = new SearchHouseModel({'values': [], 'except': 0}, {'values': [], 'except': 0},
      {'values': [], 'except': 0}, {'values': [], 'except': 0}, {'values': [], 'except': 0},
      {'values': [], 'except': 0}, '', null, null, null, null,
      '', '', '', '', '', '', '', '',
      '', '', [], [], [], [], '', '', [], [],
      [], [],  false, false, false, false, false, false, false);

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

  getStreetsInitializate() {
    this.streets = [];
    this.streets_remember = [];
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


  getStreets(city: any = 0, district: any = 0, microdistrict: any = 0, title= '') {

    console.log(this.streets_remember);

    /* добавить в массив по фильтру более 2 символов*/
    if (title.length > 2) {
      this.locationService.getStreets(city, district, microdistrict, title).subscribe((options) => {
        this.streets = [];

        /* добавить уже выбранные в массив*/
        for (let i = 0; i < this.streets_remember.length; i++) {
          this.streets.push({label: this.streets_remember[i].label, value: '' + this.streets_remember[i].value});
        }

        for (let i = 0; i < options.length; i++) {
          this.streets.push({label: options[i].title, value: '' + options[i].id});
        }
      });
    } else {
      this.streets = [];
    }
  }

  selectStreets(option: IOption) {
    this.streets_remember.push({label: `${option.label}`, value: '' + `${option.value}`}); // добавить выбранную улицу в массив, чтобы не потерялся при выборе следующего
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
      this.walls = data.walls;
      this.roofs = data.roofs;
      this.sales = data.sales;
      this.repairs = data.repairs;
      this.heating = data.heating;
      this.sewage = data.sewage;
      this.water = data.water;
    });
  }

  getCompanies() {
    return this.companyService.getCompanies().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.companies.push(data[i]);
      }
    });
  }

  selectDistrictsRb(option: IOption) {
    this.regionsSelected.push(`${option.value}`);
    this.regionsSearch = JSON.stringify(this.regionsSelected);
    this.getDistrictsRb(this.regionsSearch);
  }

  deselectDistrictsRb(option: IOption) {
    const index: number = this.regionsSelected.indexOf(`${option.value}`);
    if (index !== -1) {
      this.regionsSelected.splice(index, 1);
    }
    this.regionsSearch = JSON.stringify(this.regionsSelected);
    this.getDistrictsRb(this.regionsSearch);
  }

  selectCities(option: IOption) {
    this.districtsRbSelected.push(`${option.value}`);
    this.districtsRbSearch = JSON.stringify(this.districtsRbSelected);
  //  this.getCities(0, this.districtsRbSearch);
  }

  deselectCities(option: IOption) {
    const index: number = this.districtsRbSelected.indexOf(`${option.value}`);
    if (index !== -1) {
      this.districtsRbSelected.splice(index, 1);
    }
    this.districtsRbSearch = JSON.stringify(this.districtsRbSelected);
  //  this.getCities(0, this.districtsRbSearch);
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

  selectStreet(option: IOption) {
    this.districtsSelected.push(`${option.value}`);
    this.districtsSearch = JSON.stringify(this.districtsSelected);
   // this.getStreets(0, this.districtsSearch);
  }

  deselectStreet(option: IOption) {
    const index: number = this.districtsSelected.indexOf(`${option.value}`);
    if (index !== -1) {
      this.districtsSelected.splice(index, 1);
    }
    this.districtsSearch = JSON.stringify(this.districtsSelected);
  //  this.getStreets(0, this.districtsSearch);
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


  wallsTrigger(event) {
    if (this.arrayWalls[event]) {
      const index: number = this.search.walls.indexOf(event);
      if (index !== -1) {
        this.search.walls.splice(index, 1);
      }
    } else {
      this.search.walls.push(event);
    }
  }

  roofsTrigger(event) {
    if (this.arrayRoofs[event]) {
      const index: number = this.search.roofs.indexOf(event);
      if (index !== -1) {
        this.search.roofs.splice(index, 1);
      }
    } else {
      this.search.roofs.push(event);
    }
  }

  salesTrigger(event) {
    if (this.arraySales[event]) {
      const index: number = this.search.sales.indexOf(event);
      if (index !== -1) {
        this.search.sales.splice(index, 1);
      }
    } else {
      this.search.sales.push(event);
    }
  }

  repairsTrigger(event) {
    if (this.arrayRepairs[event]) {
      const index: number = this.search.repairs.indexOf(event);
      if (index !== -1) {
        this.search.repairs.splice(index, 1);
      }
    } else {
      this.search.repairs.push(event);
    }
  }

  heatingTrigger(event) {
    if (this.arrayHeating[event]) {
      const index: number = this.search.heating.indexOf(event);
      if (index !== -1) {
        this.search.heating.splice(index, 1);
      }
    } else {
      this.search.heating.push(event);
    }
  }

  waterTrigger(event) {
    if (this.arrayWater[event]) {
      const index: number = this.search.water.indexOf(event);
      if (index !== -1) {
        this.search.water.splice(index, 1);
      }
    } else {
      this.search.water.push(event);
    }
  }

  sewageTrigger(event) {
    if (this.arraySewage[event]) {
      const index: number = this.search.sewage.indexOf(event);
      if (index !== -1) {
        this.search.sewage.splice(index, 1);
      }
    } else {
      this.search.sewage.push(event);
    }
  }
}
