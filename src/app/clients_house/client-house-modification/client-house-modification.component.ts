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


@Component({
  selector: 'app-client-house-modification',
  templateUrl: './client-house-modification.component.html',
  styleUrls: ['./client-house-modification.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}
  ]
})
export class ClientHouseModificationComponent implements OnInit {

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

  public client: ClientHouse = new ClientHouse(0, null, null,  null, '', [],   '',
    [],  '', [], '', [], '', [], '',
    '', '', '', '', 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, [],
    [], [], false, [], [], false, false, '', 0, '',
    '', null, null,  false, false, null, null, false,
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

            this.getTypes(data.client);
            this.getWalls(data.client);
            this.getRoofs(data.client);
            this.getHeating(data.client);
            this.getWater(data.client);

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
            // выбранные местоположения
            this.client.regions = data.client.array_regions;
            this.client.districts_country = data.client.array_districts_country;
            this.client.cities = data.client.array_cities;
            this.client.districts = data.client.array_districts;
            this.client.directions = data.client.array_directions;
          });
        }
      });

    this.client.user = this.userService.setUser(this.client.user);
    this.client.user.user_information = this.userService.setUserInformation(this.client.user.user_information);
    this.client.user.manager_information = this.userService.setUserInformation(this.client.user.user_information);

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

  getTypes(data) {
    this.arrayTypes = [];
    for (let i = 0; i < data.types.length; i++) {
      this.arrayTypes[data.types[i].id] = true;
    }
  }

  getWalls(data) {
    this.arrayWalls = [];
    for (let i = 0; i < data.walls.length; i++) {
      this.arrayWalls[data.walls[i].id] = true;
    }
  }

  getRoofs(data) {
    this.arrayRoofs = [];
    for (let i = 0; i < data.roofs.length; i++) {
      this.arrayRoofs[data.roofs[i].id] = true;
    }
  }

  getHeating(data) {
    this.arrayHeating = [];
    for (let i = 0; i < data.heating.length; i++) {
      this.arrayHeating[data.heating[i].id] = true;
    }
  }

  getWater(data) {
    this.arrayWater = [];
    for (let i = 0; i < data.water.length; i++) {
      this.arrayWater[data.water[i].id] = true;
    }
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

    if (this.client.id !== 0) {
      this.clientHouseService.update(this.client).subscribe(
        data => {
          if (data.status === 200) {
            this.message('Клиент успешно обновлен', false);
            this.router.navigate(['clients_house']);
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
      this.clientHouseService.create(this.client).subscribe(
        data => {
          if (data.status === 201) {
            this.message('Клиент успешно создан', false);
            this.router.navigate(['clients_house']);
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
