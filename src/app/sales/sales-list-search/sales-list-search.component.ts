import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IOption} from 'ng-select';
import {LocationService} from '../../_services/location.service';
import {LabelService} from '../../_services/label.service';
import {Label} from '../../_models/Label.model';
import {SearchSaleModel} from '../../_models/SearchSale.model';
import {Company} from '../../_models/Company.model';
import {CompanyService} from '../../_services/company.service';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {LoginService} from '../../_services/login.service';
import {User} from '../../_models/User.model';
import {UserInformation} from '../../_models/UserInformation.model';
import {UserService} from '../../_services/user.service';
import {SharedService} from '../../_services/shared.service';

import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sales-list-search',
  templateUrl: './sales-list-search.component.html',
  styleUrls: ['./sales-list-search.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class SalesListSearchComponent implements OnInit {

  @Output() changed = new EventEmitter();

  public subscription: Subscription;

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

  public microdistricts: Array<IOption> = [
    {label: '', value: ''}
  ];

  public streets: Array<IOption> = [
    {label: '', value: ''}
  ];
  public streets_remember: Array<IOption> = [
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
  public microdistrictsSelected = [];
  public microdistrictsSearch = '';

  public hide = false;
  public hide_wall = false;
  public hide_sale = false;
  public hide_repair = false;
  public hide_other = false;

  public walls: Label[] = [];
  public furniture: Label[] = [];
  public repairs: Label[] = [];
  public sales: Label[] = [];

  public companies: Company[] = [];
  public users: User[] = [];

  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);
  public user_information: UserInformation = new UserInformation(0, '', '', '', '', '', '', null, []);

  public rooms = [
    {label: 'К', value: '0'},
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
    {label: '5+', value: '5'}
  ];
  public arrayRooms = [];
  public arrayWalls = [];
  public arraySales = [];
  public arrayRepairs = [];


  public search = new SearchSaleModel({'values': [], 'except': 0}, {'values': [], 'except': 0}, {'values': [], 'except': 0},
    {'values': [], 'except': 0}, {'values': [], 'except': 0}, {'values': [], 'except': 0}, '', '', null,
    null, null, null, [], '', '', '', '', '', '',
    '', '', '', '', '', '', {'values': false, 'except': 0}, {'values': false, 'except': 0},
    '', '', '', '', '', '', '', '', '', [], [], [], false, false,
    false, false, false, false, false);

  public search_user = {
    'company': 0
  };

  public showStreet = false;

  constructor(private locationService: LocationService,
              private labelsService: LabelService,
              private companyService: CompanyService,
              private loginService: LoginService,
              private userService: UserService,
              private sharedService: SharedService
  ) {
    this.subscription = sharedService.changeEmitted$2.subscribe(data => {
      this.user = data;
    });
  }

  ngOnInit() {
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.getUsers();
    });
    this.getRegions();
    this.getDistrictsRb();
    this.getCitiesInitializate();
    this.getStreetsInitializate();
    this.getDistricts();
    this.getMicroDistricts();
    this.getStreets();
    this.getLabels();
    this.getCompanies();
  }

  searchSales() {
    this.changed.emit(this.search);
  }

  clear() {
    this.search = new SearchSaleModel({'values': [], 'except': 0}, {'values': [], 'except': 0}, {'values': [], 'except': 0},
      {'values': [], 'except': 0}, {'values': [], 'except': 0}, {'values': [], 'except': 0}, '', '', null,
      null, null, null, [], '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', [], [], [], false, false, false,
      false, false, false, false);
    this.arrayRooms = [];
    this.arrayWalls = [];
    this.arraySales = [];
    this.arrayRepairs = [];

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


  /*getCities(region: any = 0, district_rb: any = 0) {

    this.locationService.getCities(region, district_rb).subscribe((options) => {
      this.cities = [];

      for (let i = 0; i < options.length; i++) {
        this.cities.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }*/

  getCities (region: any = 0, district_rb: any = 0, title = '') {

    /* добавить в массив по фильтру более 3 символов*/
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

  getMicroDistricts(city = 0, district: any = 0) {
    this.locationService.getMicroDistricts(city, district).subscribe((options) => {
      this.microdistricts = [];

      for (let i = 0; i < options.length; i++) {
        this.microdistricts.push({label: options[i].title, value: '' + options[i].id});
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

   /* this.locationService.getStreets(city, district, microdistrict).subscribe((options) => {
      this.streets = [];

      for (let i = 0; i < options.length; i++) {
        this.streets.push({label: options[i].title, value: '' + options[i].id});
      }
    });*/
  }

  getLabels() {
    this.labelsService.getAllLabelsSales().subscribe(data => {
      this.walls = data.walls;
      this.furniture = data.furniture;
      this.repairs = data.repairs;
      this.sales = data.sales;
    });
  }
  getCompanies() {
    return this.companyService.getCompanies().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.companies.push(data[i]);
      }
    });
  }
  getUsers() {

    this.search_user['company'] = this.user.company.id;

    return this.userService.getUsersWithoutAccess(this.search_user).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].user_information === null) {
          data[i].user_information = this.user_information;
        }
        this.users.push(data[i]);
      }
    });
  }


  selectDistrictsRb(option: IOption) {
    this.regionsSelected.push(`${option.value}`);
    this.regionsSearch = JSON.stringify(this.regionsSelected);
    this.getDistrictsRb( this.regionsSearch);
  }

  deselectDistrictsRb(option: IOption) {
    const index: number = this.regionsSelected.indexOf(`${option.value}`);
    if (index !== -1) {
      this.regionsSelected.splice(index, 1);
    }
    this.regionsSearch = JSON.stringify(this.regionsSelected);
    this.getDistrictsRb( this.regionsSearch);
  }

  selectCities(option: IOption) {
    this.districtsRbSelected.push(`${option.value}`);
    this.districtsRbSearch = JSON.stringify(this.districtsRbSelected);
   // this.getCities(0, this.districtsRbSearch);
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
  //  this.getStreets(this.citiesSearch, 0, 0);

    this.showStreet = true;


  }

  deselectDistrict(option: IOption) {
    const index: number = this.citiesSelected.indexOf(`${option.value}`);
    if (index !== -1) {
      this.citiesSelected.splice(index, 1);
    }
    this.citiesSearch = JSON.stringify(this.citiesSelected);
    this.getDistricts(this.citiesSearch);
  //  this.getStreets(this.citiesSearch, 0, 0);

    this.showStreet = false;

  }

  selectMicroDistrict(option: IOption) {
    this.districtsSelected.push(`${option.value}`);
    this.districtsSearch = JSON.stringify(this.districtsSelected);
    this.getMicroDistricts(0, this.districtsSearch);
  }

  deselectMicroDistrict(option: IOption) {
    const index: number = this.districtsSelected.indexOf(`${option.value}`);
    if (index !== -1) {
      this.districtsSelected.splice(index, 1);
    }
    this.districtsSearch = JSON.stringify(this.districtsSelected);
    this.getMicroDistricts(0, this.districtsSearch);
  }

  selectStreets(option: IOption) {
    this.streets_remember.push({label: `${option.label}`, value: '' + `${option.value}`}); // добавить выбранную улицу в массив, чтобы не потерялся при выборе следующего
  }

  deselectStreet(option: IOption) {
    const index: number = this.microdistrictsSelected.indexOf(`${option.value}`);
    if (index !== -1) {
      this.microdistrictsSelected.splice(index, 1);
    }
    this.microdistrictsSearch = JSON.stringify(this.microdistrictsSelected);
   // this.getStreets(0, 0 , this.microdistrictsSearch);
  }

  selectStreet(option: IOption) {
    this.microdistrictsSelected.push(`${option.value}`);
    this.microdistrictsSearch = JSON.stringify(this.microdistrictsSelected);
    //  this.getStreets(0, 0, this.microdistrictsSearch);
  }


  roomsTrigger(event) {
    if (this.arrayRooms[event]) {
      const index: number = this.search.rooms.indexOf(event);
      if (index !== -1) {
        this.search.rooms.splice(index, 1);
      }
    } else {
      this.search.rooms.push(event);
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
}
