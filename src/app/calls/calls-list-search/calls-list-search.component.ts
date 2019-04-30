import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IOption} from 'ng-select';
import {LocationService} from '../../_services/location.service';
import {SearchCallModel} from '../../_models/SearchCall.model';
import {LoginService} from '../../_services/login.service';
import {User} from '../../_models/User.model';
import {UserService} from '../../_services/user.service';
import {UserInformation} from '../../_models/UserInformation.model';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calls-list-search',
  templateUrl: './calls-list-search.component.html',
  styleUrls: ['./calls-list-search.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class CallsListSearchComponent implements OnInit {

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

  public streets: Array<IOption> = [
    {label: '', value: ''}
  ];

  public users: User[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);
  public user_information: UserInformation = new UserInformation(0, '', '', '', '', '', '', null, []);

  public search = new SearchCallModel('', '', {'values': []},
    {'values': []}, '', '', null, null, null,
    null, '', 0);

  public citiesSelected = [];
  public citiesSearch = '';
  public districtsRbSearch = '';

  public search_user = {
    'company': 0
  };

  constructor(private locationService: LocationService,
              private loginService: LoginService,
              private userService: UserService) { }

  ngOnInit() {
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.getUsers();
    });
    this.getRegions();
    this.getDistrictsRb();
    this.getCitiesInitializate();
    this.getStreets();
  }

  searchCalls() {
    this.changed.emit(this.search);
  }

  clear() {
    this.search = new SearchCallModel(0, 0, {'values': []},
      {'values': []}, '', '', null, null, null,
      null, '', 0);

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

  getStreets(city: any = 0) {
    this.locationService.getStreets(city).subscribe((options) => {
      this.streets = [];

      for (let i = 0; i < options.length; i++) {
        this.streets.push({label: options[i].title, value: '' + options[i].id});
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
    this.getStreets(this.citiesSearch);
  }

  deselectDistrict(option: IOption) {
    const index: number = this.citiesSelected.indexOf(`${option.value}`);
    if (index !== -1) {
      this.citiesSelected.splice(index, 1);
    }
    this.citiesSearch = JSON.stringify(this.citiesSelected);
    this.getStreets(this.citiesSearch);
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


}
