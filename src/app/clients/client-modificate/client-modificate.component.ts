import {Component, OnInit} from '@angular/core';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

// карта
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';

import {fromLonLat} from 'ol/proj';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {ClientService} from '../../_services/client.service';
import {Client} from '../../_models/Client.model';
import {UserInformation} from '../../_models/UserInformation.model';
import {User} from '../../_models/User.model';
import {IOption} from 'ng-select';
import {LocationService} from '../../_services/location.service';
import {UserService} from '../../_services/user.service';
import {LabelService} from '../../_services/label.service';
import {Metro} from '../../_models/Metro.model';
import {Label} from '../../_models/Label.model';
import {SharedService} from '../../_services/shared.service';
import {AccessModel} from '../../_models/Access.model';

@Component({
  selector: 'app-client-modificate',
  templateUrl: './client-modificate.component.html',
  styleUrls: ['./client-modificate.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}
  ]
})
export class ClientModificateComponent implements OnInit {

  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;

  public selectRegions: Array<IOption> = [
    {label: '', value: ''}
  ];
  public selectDistricts_rb: Array<IOption> = [
    {label: '', value: ''}
  ];
  public selectCities: Array<IOption> = [
    {label: '', value: ''}
  ];
  public selectDistricts: Array<IOption> = [
    {label: '', value: ''}
  ];
  public selectMicroDistricts: Array<IOption> = [
    {label: '', value: ''}
  ];

  public regions = [];
  public districts_rb = [];
  public cities = [];
  public districts = [];
  public microdistricts = [];

  public client: Client = new Client(0, null, null, null, null, '', [], '',
    null, [], '', '', '', '', '', 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    false, 0, false, false, false, false, false, '', 0, [], [],
    [], '', '', null, null, false, false, null, null, false,
    false, false);

  public user: User = new User(0, '', '', null, null, null, '',
    0, 0, 0, false, null, null, null, null, null, null);
  public user_information: UserInformation = new UserInformation(0, '', '', '', '', '', '', null, []);
  public users: User[] = [];

  public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false);

  public price_sqr_from = '';
  public price_sqr_to = '';

  public search = {
    'company': 0
  };

  public wc: Label[] = [];
  public walls: Label[] = [];
  public types: Label[] = [];
  public repairs: Label[] = [];
  public sources: Label[] = [];
  public metro: Metro[] = [];
  public metro_first: Metro[] = [];
  public metro_second: Metro[] = [];

  public timer: any;

  public hide_metro_first = false;
  public select_metro_first_all = false;
  public hide_metro_second = false;
  public select_metro_second_all = false;
  public hide_wall = false;
  public hide_repair = false;
  public hide_type = false;

  public hideme = false;
  public hideme2 = false;

  public arrayMetro = [];

  public arrayWalls = [];
  public arrayTypes = [];
  public arrayRepairs = [];

  // валидация
  public validation_phone: any = true; // flag of variable (valid input data or not)
  public message_phone: any;         // message text of invalid input data
  public validation_city: any = true; // flag of variable (valid input data or not)
  public message_city: any;         // message text of invalid input data
  public validation_price: any = true; // flag of variable (valid input data or not)
  public message_price: any;         // message text of invalid input data
  public validation_room: any = true; // flag of variable (valid input data or not)
  public message_room: any;         // message text of invalid input data

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private clientService: ClientService,
              private locationService: LocationService,
              private userService: UserService,
              private labelsService: LabelService,
              private sharedService: SharedService) {
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  keyPressNumber(event: any) {
    const pattern = /[0-9]/g;
    if (event.keyCode !== 8 && !pattern.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
    }
  }

  keyPressPoint(event: any) {
    const pattern = /[0-9]/g;
    if (event.keyCode !== 8 && event.keyCode !== 46 && event.keyCode !== 190 && !pattern.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
    }
  }

  ngOnInit() {

    this.route.params.subscribe(
      params => {
        if (params['id']) {
          this.route.data.subscribe(({data}) => {
            this.client = data.client;

            this.getWalls(data.client);
            this.getTypesHouse(data.client);
            this.getRepairs(data.client);

            this.getMetro(data.client);

            this.client.contract_from = new NgbDateFRParserFormatter().parse(data.client.contract_from);
            this.client.contract_to = new NgbDateFRParserFormatter().parse(data.client.contract_to);

            if (this.client.contract) {
              const pos = this.client.contract.indexOf('/');
              if (pos !== -1) {
                this.client.contract_fraction = this.client.contract.substring(pos);
                this.client.contract = this.client.contract.substring(0, pos);
              } else {
                this.client.contract_fraction = '';
              }
            }
            // выбранные районы и микрорайоны
            this.client.districts = data.client.array_districts;
            this.client.microdistricts = data.client.array_microdistricts;
          });
        }
      });

    this.client.user = this.userService.setUser(this.client.user);
    this.client.user.user_information = this.userService.setUserInformation(this.client.user.user_information);
    this.client.user.manager_information = this.userService.setUserInformation(this.client.user.user_information);

    this.client.city = this.locationService.setCity(this.client.city);
    this.client.city.district_country = this.locationService.setDistrictCountry(this.client.city.district_country);
    this.client.city.district_country.region = this.locationService.setRegion(this.client.city.district_country.region);

    this.getRegions();
    this.getDistrictsRb();
    this.getCities();
    this.getDistricts();
    this.getMicroDistricts();
    this.getAllLocations();
    this.getAllLabels();

    this.getPriceSqr();
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.access = data.array_access;
      this.getUsers();

    });

    /* Подгрузка карты*/
    this.source = new OlXYZ({
      url: 'https://tile.osm.org/{z}/{x}/{y}.png'
    });

    this.layer = new OlTileLayer({
      source: this.source
    });

    this.view = new OlView({
      center: fromLonLat([27.56164, 53.902257]),
      zoom: 14
    });

    this.map = new OlMap({
      target: 'map',
      layers: [this.layer],
      view: this.view
    });
    /* Подгрузка карты*/
  }

  getAllLabels() {
    this.labelsService.getAllLabelsSales().subscribe(data => {
      this.wc = data.wc;
      this.walls = data.walls;
      this.types = data.types;
      this.repairs = data.repairs;
      this.sources = data.sources;
    });
  }

  getAllLocations() {
    this.locationService.getAllLocations().subscribe((data) => {
      this.regions = data.regions;
      this.districts_rb = data.districts_rb;
      this.cities = data.cities;
      this.districts = data.districts;
      this.microdistricts = data.microdistricts;
      this.metro = data.metro;
      this.getMetroFirstLine();
      this.getMetroSecondLine();
    });
  }

  getRegions() {
    this.locationService.getRegions().subscribe((options) => {
      this.selectRegions = [];
      for (let i = 0; i < options.length; i++) {
        this.selectRegions.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getDistrictsRb(region = 0) {
    this.locationService.getDistrictsRb(region).subscribe((options) => {
      this.selectDistricts_rb = [];
      for (let i = 0; i < options.length; i++) {
        this.selectDistricts_rb.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getCities(region = 0, districts_rb = 0) {
    this.locationService.getCities(region, districts_rb).subscribe((options) => {
      this.selectCities = [];
      for (let i = 0; i < options.length; i++) {
        this.selectCities.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getDistricts(city = 0) {
    this.locationService.getDistricts(city).subscribe((options) => {
      this.selectDistricts = [];
      for (let i = 0; i < options.length; i++) {
        this.selectDistricts.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getMicroDistricts(city = 0, disctrict = 0) {
    this.locationService.getMicroDistricts(city, disctrict).subscribe((options) => {
      this.selectMicroDistricts = [];
      for (let i = 0; i < options.length; i++) {
        this.selectMicroDistricts.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getDistrictRb(option: IOption) {
    this.getDistrictsRb(+`${option.value}`);
  }

  getCity(option: IOption) {
    this.getCities(0, +`${option.value}`);
  }

  getDistrict(option: IOption) {
    this.getDistricts(+`${option.value}`);
  }

  getMicroDistrict(option: IOption) {
    this.getMicroDistricts(+`${option.value}`);
  }

  getMetroFirstLine() {
    return this.metro_first = this.metro.filter(m => m.line === 1);
  }

  getMetroSecondLine() {
    return this.metro_second = this.metro.filter(m => m.line === 2);
  }

  getLocation(option: IOption) {

    const district = this.cities.find(x => x.id === +`${option.value}`).district_id;
    if (district) {
      this.client.city.district_country.id = district;

      const region = this.districts_rb.find(x => x.id === district).region_id;
      if (region) {
        this.client.city.district_country.region.id = region;
      }
    }
  }

  getPriceSqr() {
    if ('' + this.client.area_to !== '' && '' + this.client.area_to !== '0') {
      this.price_sqr_from = '' + Math.floor(+this.client.price / +this.client.area_to);
    } else {
      this.price_sqr_from = '';
    }
    if ('' + this.client.area_from !== '' && '' + this.client.area_from !== '0') {
      this.price_sqr_to = '' + Math.floor(+this.client.price / +this.client.area_from);
    } else {
      this.price_sqr_to = '';
    }
  }

  getUsers() {

    this.search['company'] = this.user.company.id;

    return this.userService.getUsersWithoutAccess(this.search).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].user_information === null) {
          data[i].user_information = this.user_information;
        }
        this.users.push(data[i]);
      }
    });
  }

  getManager(user) {
    this.client.user = this.userService.setUser(this.users.find(u => u.id === +user));
    this.client.user.manager_information = this.userService.setUserInformation(this.client.user.manager_information);
  }

  getMetro(data) {
    this.arrayMetro = [];
    for (let i = 0; i < data.metro.length; i++) {
      this.arrayMetro[data.metro[i].id] = true;
    }
  }

  allMetroFirst() {
    this.select_metro_first_all = !this.select_metro_first_all;
    for (let i = 0; i < this.metro_first.length; i++) {
      if (this.select_metro_first_all) {
        this.arrayMetro[this.metro_first[i].id] = true;

        if (this.client.metro.find(m => m.id === this.metro_first[i].id) === undefined) {
          this.client.metro.push(this.metro.find(m => m.id === +this.metro_first[i].id));
        }
      } else {
        this.arrayMetro[this.metro_first[i].id] = false;
        this.client.metro = this.client.metro.filter(m => m.id !== +this.metro_first[i].id);
      }
    }
  }

  allMetroSecond() {
    this.select_metro_second_all = !this.select_metro_second_all;
    for (let i = 0; i < this.metro_second.length; i++) {
      if (this.select_metro_second_all) {
        this.arrayMetro[this.metro_second[i].id] = true;

        if (this.client.metro.find(m => m.id === this.metro_second[i].id) === undefined) {
          this.client.metro.push(this.metro.find(m => m.id === +this.metro_second[i].id));
        }
      } else {
        this.arrayMetro[this.metro_second[i].id] = false;
        this.client.metro = this.client.metro.filter(m => m.id !== +this.metro_second[i].id);
      }
    }
  }

  getWalls(data) {
    this.arrayWalls = [];
    for (let i = 0; i < data.walls.length; i++) {
      this.arrayWalls[data.walls[i].id] = true;
    }
  }

  getTypesHouse(data) {
    this.arrayTypes = [];
    for (let i = 0; i < data.types_house.length; i++) {
      this.arrayTypes[data.types_house[i].id] = true;
    }
  }

  getRepairs(data) {
    this.arrayRepairs = [];
    for (let i = 0; i < data.repairs.length; i++) {
      this.arrayRepairs[data.repairs[i].id] = true;
    }
  }


  metroTrigger(event) {
    if (this.arrayMetro[event]) {
      this.client.metro = this.client.metro.filter(m => m.id !== +event);
    } else {
      this.client.metro.push(this.metro.find(m => m.id === +event));
    }
  }

  wallsTrigger(event) {
    if (this.arrayWalls[event]) {
      this.client.walls = this.client.walls.filter(m => m.id !== +event);
    } else {
      this.client.walls.push(this.walls.find(m => m.id === +event));
    }
  }

  typesTrigger(event) {
    if (this.arrayTypes[event]) {
      this.client.types_house = this.client.types_house.filter(m => m.id !== +event);
    } else {
      this.client.types_house.push(this.types.find(m => m.id === +event));
    }
  }

  repairsTrigger(event) {
    if (this.arrayRepairs[event]) {
      this.client.repairs = this.client.repairs.filter(m => m.id !== +event);
    } else {
      this.client.repairs.push(this.repairs.find(m => m.id === +event));
    }
  }

  save() {
    this.client.contract_from = new NgbDateFRParserFormatter().format_to_base(this.client.contract_from);
    this.client.contract_to = new NgbDateFRParserFormatter().format_to_base(this.client.contract_to);

    console.log(this.client);
    if (this.validation() === true) {

      if (this.client.id !== 0) {
        this.clientService.update(this.client).subscribe(
          data => {
            if (data.status === 200) {
              this.message('Клиент успешно обновлен', false);
              this.router.navigate(['clients']);
            } else {
              this.message('Не удалось обновить клиента!', true);

              this.client.contract_from = new NgbDateFRParserFormatter().parse('' + this.client.contract_from);
              this.client.contract_to = new NgbDateFRParserFormatter().parse('' + this.client.contract_to);
            }
          },
          error => {
            if (error.status === 401) {
              this.router.navigate(['']);
            } else {
              this.message('Ошибка!', true);

              this.client.contract_from = new NgbDateFRParserFormatter().parse('' + this.client.contract_from);
              this.client.contract_to = new NgbDateFRParserFormatter().parse('' + this.client.contract_to);
            }
          }
        );
      } else {
        this.clientService.create(this.client).subscribe(
          data => {
            if (data.status === 201) {
              this.message('Клиент успешно создан', false);
              this.router.navigate(['clients']);
            } else {
              this.message('Не удалось создать клиента!', true);

              this.client.contract_from = new NgbDateFRParserFormatter().parse('' + this.client.contract_from);
              this.client.contract_to = new NgbDateFRParserFormatter().parse('' + this.client.contract_to);
            }
          },
          error => {
            if (error.status === 401) {
              this.router.navigate(['']);
            } else {
              this.message('Ошибка!', true);

              this.client.contract_from = new NgbDateFRParserFormatter().parse('' + this.client.contract_from);
              this.client.contract_to = new NgbDateFRParserFormatter().parse('' + this.client.contract_to);
            }
          }
        );
      }
    }
  }

  /*  Валидация */
  validationPhone(): boolean {
    if (this.client.phone1.length > 0) {
      this.validation_phone = true;
      this.message_phone = '';

      return true;
    } else {
      this.validation_phone = false;
      this.message_phone = 'Обязательное поле';

      return false;
    }
  }

  validationCity(): boolean {

    if (this.client.city.id) {
      this.validation_city = true;
      this.message_city = '';

      return true;
    } else {
      this.validation_city = false;
      this.message_city = 'Обязательное поле';

      return false;
    }
  }

  validationRoom(): boolean {
    if (this.client.room_from > 0) {
      this.validation_room = true;
      this.message_room = '';

      return true;
    } else {
      this.validation_room = false;
      this.message_room = 'Обязательное поле';

      return false;
    }
  }


  validationPrice(): boolean {
    if (this.client.price > 0) {
      this.validation_price = true;
      this.message_price = '';

      return true;
    } else {
      this.validation_price = false;
      this.message_price = 'Обязательное поле';

      return false;
    }
  }

  validation(): boolean {

    if (this.validationPhone() === true && this.validationCity() === true && this.validationPrice() === true && this.validationRoom() === true) {
      return true;
    }
    return false;
  }

  /*  Конец валидации */

}
