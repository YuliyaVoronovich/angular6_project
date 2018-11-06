import { Component, OnInit } from '@angular/core';
import {IOption} from 'ng-select';
import {Photo} from '../../_models/photo.model';
import {UserInformation} from '../../_models/userInformation.model';
import {User} from '../../_models/user.model';
import {LabelService} from '../../_services/label.service';
import {LocationService} from '../../_services/location.service';
import {ImageService} from '../../_services/image.service';
import {SharedService} from '../../_services/shared.service';
import {LoginService} from '../../_services/login.service';
import {UserService} from '../../_services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HouseService} from '../../_services/house.service';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {Label} from '../../_models/label.model';
import {Metro} from '../../_models/metro.model';
import {House} from '../../_models/house.model';
import {HouseAdditionInformation} from '../../_models/houseAdditionInformation.model';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

// карта
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import {Style, Icon} from 'ol/Style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

import {fromLonLat} from 'ol/proj';
import {FileHolder} from 'angular2-image-upload';

@Component({
  selector: 'app-house-modificate',
  templateUrl: './house-modificate.component.html',
  styleUrls: ['./house-modificate.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}
  ]
})
export class HouseModificateComponent implements OnInit {

  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;
  marker: Feature;


  public regions: Array<IOption> = [
    {label: '', value: ''}
  ];

  public districts_country: Array<IOption> = [
    {label: '', value: ''}
  ];

  public cities: Array<IOption> = [
    {label: '', value: ''}
  ];

  public streets: Array<IOption> = [
    {label: '', value: ''}
  ];

  public walls: Label[] = [];
  public types: Label[] = [];
  public repairs: Label[] = [];
  public roofs: Label[] = [];
  public sales: Label[] = [];
  public sources: Label[] = [];
  public sewage: Label[] = [];
  public heating: Label[] = [];
  public water: Label[] = [];
  public gas: Label[] = [];
  public electricity: Label[] = [];

  public arrayTypes = [];
  public activeTypes = 0;

  public metro: Metro[] = [];

  public house: House = new House(0, null, null, '', '', '', '', null, null, false,
    '' , 0, 0, false, false, false, false, 0, '', null, '',
    '', 0, null, 0, 0, 0, 0, 0, 0, 0, 0, null, 0, false, false,
    false, '', 0, 0, 0, 0, 0, 0, false, '', '', '', null, false,
    null, null, null, '');
  public house_addition_information: HouseAdditionInformation = new HouseAdditionInformation(0, false
    , false, false, false, false, false, false, false, false, false, false
    , false, false, false, false, false, false, false, false, false, false);


  public user: User = new User(0, '', '', null, null, null, '',
    0, 0, 0, null, null, null, null, null, null);
  public user_information: UserInformation = new UserInformation(0, '', '', '', '', '', '', null, []);
  public users: User[] = [];

  public contract_from;
  public contract_to;

  public images: Photo [] = [];
  public upload_photo = [];

  public search = {
    'company': 0
  };

  public timer: any;

  public displayRequest = false;
  public textRequest = '';
  public idSaleRequest = 0;
  public request = {};

  public noResultsTerm = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private houseService: HouseService,
              private labelsService: LabelService,
              private locationService: LocationService,
              private userService: UserService,
              private imageService: ImageService,
              private sharedService: SharedService) { }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  keyPress(event: any) {
    const pattern = /[0-9]/g;
    if (event.keyCode !== 8 && !pattern.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        if (params['id']) {
          this.route.data.subscribe(({data}) => {
            this.house = data.house;
            if (this.house.user === null) {
              this.house.user = this.user;
              this.house.user.user_information = this.user_information;
              this.house.user.manager_information = this.user_information;
            }
            if (this.house.house_addition_information === null) {
              this.house.house_addition_information = this.house_addition_information;
            }

            for (let i = 0; i < this.house.photo.length; i++) {
              this.upload_photo.push(this.house.photo[i].path);
              //  console.log(this.upload_photo);
            }
            this.house.contract_from = new NgbDateFRParserFormatter().parse(data.house.contract_from);
            this.house.contract_to = new NgbDateFRParserFormatter().parse(data.house.contract_to);

            if (data.house.type !== 0) {// для типа дома
              this.arrayTypes[data.house.type] = true;
              this.activeTypes = data.house.type;
            }

          });
        } else {
          this.house.house_addition_information = this.house_addition_information;
          this.house.user = this.user;
          this.house.user.user_information = this.user_information;
          this.house.user.manager_information = this.user_information;
        }
      });

    this.house.location = this.locationService.setLocation(this.house.location);
    this.house.location.city = this.locationService.setCity(this.house.location.city);
    this.house.location.city.district_country = this.locationService.setDistrictCountry(this.house.location.city.district_country);
    this.house.location.city.district_country.region = this.locationService.setRegion(this.house.location.city.district_country.region);
    this.house.location.district = this.locationService.setDistrict(this.house.location.district);
    this.house.location.microdistrict = this.locationService.setMicroDistrict(this.house.location.microdistrict);
    this.house.location.street = this.locationService.setStreet(this.house.location.street);
    this.house.location.metro = this.locationService.setMetro(this.house.location.metro);
    this.house.location.direction = this.locationService.setDirection(this.house.location.direction);


    this.labelsService.getAllLabelsHouses().subscribe(data => {
      this.walls = data.walls;
      this.types = data.types;
      this.repairs = data.repairs;
      this.roofs = data.roofs;
      this.sales = data.sales;
      this.sources = data.sources;
      this.sewage = data.sewage;
      this.heating = data.heating;
      this.water = data.water;
      this.gas = data.gas;
      this.electricity = data.electricity;
    });
    this.locationService.getAllLocations().subscribe(data => {
      this.metro = data.metro;
    });

    this.getRegions();
    this.getDistrictsRb(this.house.location.city.district_country.region.id);
    this.getCities(this.house.location.city.district_country.id);
    this.getStreets(this.house.location.city.id);
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.getUsers();

    });

    /* Подгрузка карты*/

    this.marker = new Feature({
      geometry: new Point([27.56164, 53.902254])
    });

    this.source = new OlXYZ({
      url: 'http://tile.osm.org/{z}/{x}/{y}.png',
      features: this.marker
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

  getRegions() {
    this.locationService.getRegions().subscribe((options) => {
      this.regions = [];
      for (let i = 0; i < options.length; i++) {
        this.regions.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }
  getDistrictsRb(region = 0) {
    this.locationService.getDistrictsRb(region).subscribe((options) => {
      this.districts_country = [];
      for (let i = 0; i < options.length; i++) {
        this.districts_country.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getCities(district = 0) {
    this.locationService.getCities(0, district).subscribe((options) => {
      this.cities = [];
      for (let i = 0; i < options.length; i++) {
        this.cities.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getStreets(city = 0, district = 0, microdistrict = 0) {
    this.locationService.getStreets(city, district, microdistrict).subscribe((options) => {
      this.streets = [];
      /*if (options.length === 0) {
        this.displayReq = true;
      }*/
      for (let i = 0; i < options.length; i++) {
        this.streets.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  district_rb(option: IOption) {
    this.getDistrictsRb(+`${option.value}`);
  }

  city(option: IOption) {
    this.getCities(+`${option.value}`);
  }

  street(option: IOption) {
    this.getStreets(+`${option.value}`);
  }

  getInfoLocation() {

    if (this.house.location.street.id && this.house.location.house) {

      this.search['street'] = this.house.location.street.id;
      this.search['house'] = (this.house.location.house) ? this.house.location.house : 0;
      this.search['housing'] = (this.house.location.housing) ? this.house.location.housing : 0;

      this.locationService.getLocation(this.search).subscribe((data) => {
     //   console.log(data);
        if (data) {
          this.house.location.district = this.locationService.setDistrict(data.district);
          this.house.location.microdistrict = this.locationService.setMicroDistrict(data.microdistrict);
          this.house.location.direction = this.locationService.setDirection(data.direction);
          this.house.location.metro = this.locationService.setMetro(data.metro);
        } else {
          this.house.location.district = this.locationService.setDistrict(null);
          this.house.location.microdistrict = this.locationService.setMicroDistrict(null);
          this.house.location.direction = this.locationService.setDirection(null);
          this.house.location.metro = this.locationService.setMetro(null);
        }
      });
    } else {
      this.house.location.district = this.locationService.setDistrict(null);
      this.house.location.microdistrict = this.locationService.setMicroDistrict(null);
      this.house.location.direction = this.locationService.setDirection(null);
      this.house.location.metro = this.locationService.setMetro(null);
    }
  }

  typesTrigger(event) {

    this.arrayTypes[this.activeTypes] = false;
    this.arrayTypes[event] = true;
    this.activeTypes = event;
    this.house.type = event;

  }

  onFilterInputChanged(searchTerm) {
    this.house.location.street.title = searchTerm;

    this.noResultsTerm = '';

    setTimeout(() => {
      if (this.noResultsTerm === '') {
        this.displayRequest = false;
      } else {
        this.displayRequest = true;
      }
    }, 150);

  }

  onNoOptionsFound(searchTerm) {
    setTimeout(() => {
      this.noResultsTerm = searchTerm;
    }, 100);
  }

  sendRequest() {

    this.request['house'] = (this.house.id !== 0) ? this.house.id : this.idSaleRequest;
    this.request['location'] = this.house.location;
    this.request['streetRequest'] = this.house.streetRequest;
    this.request['textRequest'] = this.textRequest;

    return this.houseService.newLocationRequest(this.request).subscribe(data => {

      console.log(data);

      if (data.status === 200) {
        this.message('Заявка по адресу отправлена на модерацию', false);
        this.displayRequest = false;

      } else {
        this.message('Не удалось отправить заявку!', true);
      }
    });
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
    this.house.user.manager_information = this.users.find(u => u.id === +user).manager_information;
  }

  save() {
    this.contract_from = new NgbDateFRParserFormatter().format_to_base(this.house.contract_from);
    this.contract_to = new NgbDateFRParserFormatter().format_to_base(this.house.contract_to);
    this.house.contract_from = this.contract_from;
    this.house.contract_to = this.contract_to;

    this.house.location.street.id  = (this.house.location.street.id !== undefined) ? this.house.location.street.id  : 0;

    this.house.photo = this.upload_photo;
    console.log(this.house);

    if (this.house.id !== 0) {
      this.houseService.update(this.house).subscribe(
        data => {

          if (data) {
            this.message('Объект успешно обновлен', false);
            this.router.navigate(['houses']);
            // создание заявки если была введена неизвестная улица или автоматическая заявка
            // (новый дом на улице или в городе нет улицы - создана новая локация)
            if (this.house.location.street.id === 0 || data.new_location === true) {
              this.sendRequest();
            }
          } else {
            this.message('Не удалось обновить объект!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка!', true);
          }
        }
      );
    } else {
     this.houseService.create(this.house).subscribe(
        data => {
          if (data) {
            this.message('Объект успешно создан', false);
            this.router.navigate(['houses']);

            this.idSaleRequest = data.house.id; // id созданного house
            // создание заявки если была введена неизвестная улица или автоматическая заявка
            // (новый дом на улице или в городе нет улицы - создана новая локация)
            if (this.house.location.street.id === 0 || data.new_location === true) {
              this.sendRequest();
            }
          } else {
            this.message('Не удалось создать объект!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка!', true);
          }
        }
      );
    }
  }

  onUploadFinished(file: FileHolder) {
    const im = new Photo(file.src, '', '');
    this.upload_photo.push(im.path);
    this.house.photo = this.upload_photo;
      console.log(this.house.photo);
  }

  onRemoved(file: FileHolder) {
    const index: number = this.upload_photo.indexOf(file.src);

    // удаление фотографии на сервере
    this.imageService.delete(file.src).subscribe(
      data => {
        if (data.status === 200) {
          if (index !== -1) {
            this.upload_photo.splice(index, 1);
          }
        }
      },
      error => {
      }
    );
    //  console.log(this.upload_photo);
    this.house.photo = this.upload_photo;
  }

}