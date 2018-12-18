import {Component, OnInit} from '@angular/core';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {ClientHouseService} from '../../_services/client_house.service';
import {ClientHouse} from '../../_models/ClientHouse.model';
import {UserInformation} from '../../_models/UserInformation.model';
import {User} from '../../_models/User.model';
import {IOption} from 'ng-select';
import {LocationService} from '../../_services/location.service';
import {UserService} from '../../_services/user.service';
import {LabelService} from '../../_services/label.service';
import {Label} from '../../_models/Label.model';
import {SharedService} from '../../_services/shared.service';
import {AccessModel} from '../../_models/Access.model';
import {CallHouse} from '../../_models/CallHouse.model';
import {HouseService} from '../../_services/house.service';
import {CallHouseService} from '../../_services/call_house.service';

// карта
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';

import {fromLonLat} from 'ol/proj';


@Component({
  selector: 'app-call-house-modificate',
  templateUrl: './call-house-modificate.component.html',
  styleUrls: ['./call-house-modificate.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}
  ]
})
export class CallHouseModificateComponent implements OnInit {

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
  public selectDirections: Array<IOption> = [
    {label: '', value: ''}
  ];

  public regions = [];
  public districts_rb = [];
  public cities = [];
  public districts = [];

  public client: ClientHouse = new ClientHouse(0, null, null, null, '', [], '',
    [], '', [], '', [], '', [], '',
    '', '', '', '', 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, [],
    [], [], false, [], [], false, false, '', 0, '',
    '', null, null, false, false, null, null, false,
    false, false);

  public call: CallHouse = new CallHouse(0, null, null, '', null, '', '', '', '', 0, null, null);

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

  public types: Label[] = [];
  public walls: Label[] = [];
  public roofs: Label[] = [];
  public heating: Label[] = [];
  public water: Label[] = [];
  public sources: Label[] = [];

  public timer: any;

  public hide_wall = false;
  public hide_roof = false;
  public hide_heating = false;
  public hide_water = false;

  public arrayWalls = [];
  public arrayTypes = [];
  public arrayRoofs = [];
  public arrayHeating = [];
  public arrayWater = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private clientHouseService: ClientHouseService,
              private houseService: HouseService,
              private locationService: LocationService,
              private callHouseService: CallHouseService,
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

            this.call = data.call;

            this.call.user = this.userService.setUser(this.call.user);
            this.call.user.user_information = this.userService.setUserInformation(this.call.user.user_information);
            this.call.user.manager_information = this.userService.setUserInformation(this.call.user.user_information);

            this.call.house = this.houseService.setHouse(this.call.house);
             // адрес объекта
            this.call.house.location = this.locationService.setLocation(this.call.house.location);
            this.call.house.location.city = this.locationService.setCity(this.call.house.location.city);
            this.call.house.location.city.district_country = this.locationService.setDistrictCountry(this.call.house.location.city.district_country);
            this.call.house.location.city.district_country.region = this.locationService.setRegion(this.call.house.location.city.district_country.region);
            this.call.house.location.district = this.locationService.setDistrict(this.call.house.location.district);
            this.call.house.location.direction = this.locationService.setDirection(this.call.house.location.direction);
              // labels
            this.call.source = this.labelsService.setSaleSource(this.call.source);
            this.call.house.type = this.labelsService.setTypeHouse(this.call.house.type);

            // соотнести информацию о звонке с клиентом
            this.arrayTypes[data.call.house.type.id] = true;
            this.client.phone1 = this.call.phone;
            this.client.price = this.call.house.price;
            this.client.description = this.call.description;
            this.client.source = this.call.source.id;
            this.client.user = this.call.user;
            this.client.user.user_information = this.call.user.user_information;
            this.client.user.manager_information = this.call.user.manager_information;

            this.client.cities = '' + this.call.house.location.city.id;
            this.client.districts_country = '' + this.call.house.location.city.district_country.id;
            this.client.regions = '' + this.call.house.location.city.district_country.region.id;
            this.client.districts = '' + this.call.house.location.district.id;
            this.client.directions = '' + this.call.house.location.direction.id;

          });
        }
      });


    this.getRegions();
    this.getDistrictsRb();
    this.getCities();
    this.getDistricts();
    this.getDirections();
    this.getAllLocations();
    this.getAllLabels();

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
    this.labelsService.getAllLabelsHouses().subscribe(data => {
      this.types = data.types;
      this.walls = data.walls;
      this.roofs = data.roofs;
      this.heating = data.heating;
      this.water = data.water;
      this.sources = data.sources;
    });
  }

  getAllLocations() {
    this.locationService.getAllLocations().subscribe((data) => {
      this.regions = data.regions;
      this.districts_rb = data.districts_rb;
      this.cities = data.cities;
      this.districts = data.districts;
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

  getDirections() {
    this.locationService.getDirections().subscribe((options) => {
      this.selectDirections = [];
      for (let i = 0; i < options.length; i++) {
        this.selectDirections.push({label: options[i].title, value: '' + options[i].id});
      }
    });
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

    return this.userService.getUsers(this.search).subscribe(data => {
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

  typesTrigger(event) {
    if (this.arrayTypes[event]) {
      this.client.types = this.client.types.filter(m => m.id !== +event);
    } else {
      this.client.types.push(this.types.find(m => m.id === +event));
    }
  }

  wallsTrigger(event) {
    if (this.arrayWalls[event]) {
      this.client.walls = this.client.walls.filter(m => m.id !== +event);
    } else {
      this.client.walls.push(this.walls.find(m => m.id === +event));
    }
  }

  roofsTrigger(event) {
    if (this.arrayRoofs[event]) {
      this.client.roofs = this.client.roofs.filter(m => m.id !== +event);
    } else {
      this.client.roofs.push(this.roofs.find(m => m.id === +event));
    }
  }

  heatingTrigger(event) {
    if (this.arrayHeating[event]) {
      this.client.heating = this.client.heating.filter(m => m.id !== +event);
    } else {
      this.client.heating.push(this.heating.find(m => m.id === +event));
    }
  }

  waterTrigger(event) {
    if (this.arrayWater[event]) {
      this.client.water = this.client.water.filter(m => m.id !== +event);
    } else {
      this.client.water.push(this.water.find(m => m.id === +event));
    }
  }

  save() {
    this.client.contract_from = new NgbDateFRParserFormatter().format_to_base(this.client.contract_from);
    this.client.contract_to = new NgbDateFRParserFormatter().format_to_base(this.client.contract_to);

    console.log(this.client);

    this.clientHouseService.create(this.client).subscribe(
      data => {
        if (data.status === 201) {
          this.message('Клиент успешно перенесен', false);
          this.router.navigate(['calls_house']);

          // обновить статус звонка
          this.call.ready = 2;
          this.callHouseService.updateReady(this.call).subscribe();
        } else {
          this.message('Не удалось перенести клиента!', true);

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
