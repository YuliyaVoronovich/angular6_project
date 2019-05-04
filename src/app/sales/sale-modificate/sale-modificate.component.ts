import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Sale} from '../../_models/Sale.model';
import {Label} from '../../_models/Label.model';
import {Region} from '../../_models/Region.model';
import {Metro} from '../../_models/Metro.model';

import {LoginService} from '../../_services/login.service';
import {SaleService} from '../../_services/sale.service';
import {LabelService} from '../../_services/label.service';
import {LocationService} from '../../_services/location.service';

import {NgbDatepickerConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {IOption} from 'ng-select';
import {SharedService} from '../../_services/shared.service';
import {UserService} from '../../_services/user.service';
import {User} from '../../_models/User.model';
import {UserInformation} from '../../_models/UserInformation.model';

import {Photo} from '../../_models/Photo.model';
import {FileHolder} from 'angular2-image-upload';
import {ImageService} from '../../_services/image.service';
import {RequestService} from '../../_services/request.service';
import {AccessModel} from '../../_models/Access.model';

@Component({
  selector: 'app-sale-modificate',
  templateUrl: './sale-modificate.component.html',
  styleUrls: ['./sale-modificate.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}
  ]
})


export class SaleModificateComponent implements OnInit {

  public number_dogovor = [1, 2, 3, 4, 5, 20];

  public selectRegions: Array<IOption> = [
    {label: '', value: ''}
  ];

  public selectDistrictsRb: Array<IOption> = [
    {label: '', value: ''}
  ];

  public selectCities: Array<IOption> = [
    {label: '', value: ''}
  ];

  public selectStreets: Array<IOption> = [
    {label: '', value: ''}
  ];

  public regions = [];
  public districts_rb = [];
  public cities = [];

  public wc: Label[] = [];
  public walls: Label[] = [];
  public balconies: Label[] = [];
  public terraces: Label[] = [];
  public levels: Label[] = [];
  public types: Label[] = [];
  public repairs: Label[] = [];
  public floors: Label[] = [];
  public furniture: Label[] = [];
  public sales: Label[] = [];
  public sources: Label[] = [];
  public metro: Metro[] = [];

  public sale: Sale = new Sale(0, null, null, '', '', '', 0, 0, false,
    '', false, false, false, '', '', null, null, false, '', null,
    '', 0, 0, 0, 0, 0, 0, '', 0, 0, 0, false, false, false, 0,
    0, 0, 0, 0, '', 0, false, '', '', false, 0, 0, null,
    null, null, null, false, false, false, null, null, null,
    null, false, false, false, false);

  public user: User = new User(0, '', '', null, null, null, '',
    0, 0, 0, false, null, null, null, null, null, null);
  public user_information: UserInformation = new UserInformation(0, '', '', '', '', '', '', null, []);
  public users: User[] = [];

  public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false);

  public images: Photo [] = [];
  public upload_photo = [];

  public search = {
    'company': 0
  };

  public timer: any;

  public displayRequest = false;
  public textRequest = '';
  public idSaleRequest = 0;
  public streetRequest = '';
  public request = {};
  public noResultsTerm = '';

  public movieMapMarker = false;

  public show_district_country = false;
  public show_city = false;
  public show_street = false;

  // валидация
  public validation_region: any = true; // flag of variable (valid input data or not)
  public message_region: any;         // message text of invalid input data
  public validation_city: any = true; // flag of variable (valid input data or not)
  public message_city: any;         // message text of invalid input data
  public validation_house: any = true; // flag of variable (valid input data or not)
  public message_house: any;         // message text of invalid input data
  public validation_room: any = true; // flag of variable (valid input data or not)
  public message_room: any;         // message text of invalid input data
  public validation_area: any = true; // flag of variable (valid input data or not)
  public message_area: any;         // message text of invalid input data
  public validation_area_leave: any = true; // flag of variable (valid input data or not)
  public message_area_leave: any;         // message text of invalid input data
  public validation_area_kitchen: any = true; // flag of variable (valid input data or not)
  public message_area_kitchen: any;         // message text of invalid input data
  public validation_storey: any = true; // flag of variable (valid input data or not)
  public message_storey: any;         // message text of invalid input data
  public validation_storeys: any = true; // flag of variable (valid input data or not)
  public message_storeys: any;         // message text of invalid input data
  public validation_price: any = true; // flag of variable (valid input data or not)
  public message_price: any;         // message text of invalid input data

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private saleService: SaleService,
              private locationService: LocationService,
              private labelService: LabelService,
              private userService: UserService,
              private imageService: ImageService,
              private requestService: RequestService,
              private sharedService: SharedService) {
    /*
        this.subscription = sharedService.changeEmitted$3.subscribe(data => {
          this.userInfo = data;
        });*/
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
            this.sale = data.sale;

            for (let i = 0; i < this.sale.photo_reclame.length; i++) {
              this.upload_photo.push(this.sale.photo_reclame[i].path);
              //  console.log(this.upload_photo);
            }
            this.sale.contract_from = new NgbDateFRParserFormatter().parse(data.sale.contract_from);
            this.sale.contract_to = new NgbDateFRParserFormatter().parse(data.sale.contract_to);

            if (this.sale.contract) {
              const pos = this.sale.contract.indexOf('/');
              if (pos !== -1) {
                this.sale.contract_fraction = this.sale.contract.substring(pos);
                this.sale.contract = this.sale.contract.substring(0, pos);
              } else {
                this.sale.contract_fraction = '';
              }
            }
          });

          this.selectCities.push({label: this.sale.location.city.title, value: '' + this.sale.location.city.id});

          this.show_district_country = true;
          this.show_city = true;
          this.show_street = true;

        } else {
          this.selectCities = [];
          /*if (this.access.sales_create === false) {
           this.router.navigate(['/403']);
         }*/
        }
      });

    this.sale.sale_addition_information = this.saleService.setSaleAdditionInformation(this.sale.sale_addition_information);

    this.sale.user = this.userService.setUser(this.sale.user);
    this.sale.user.user_information = this.userService.setUserInformation(this.sale.user.user_information);
    this.sale.user.manager_information = this.userService.setUserInformation(this.sale.user.user_information);

    this.sale.location = this.locationService.setLocation(this.sale.location);
    this.sale.location.city = this.locationService.setCity(this.sale.location.city);
    this.sale.location.city.district_country = this.locationService.setDistrictCountry(this.sale.location.city.district_country);
    this.sale.location.city.district_country.region = this.locationService.setRegion(this.sale.location.city.district_country.region);
    this.sale.location.district = this.locationService.setDistrict(this.sale.location.district);
    this.sale.location.microdistrict = this.locationService.setMicroDistrict(this.sale.location.microdistrict);
    this.sale.location.street = this.locationService.setStreet(this.sale.location.street);
    this.sale.location.metro = this.locationService.setMetro(this.sale.location.metro);
    this.sale.location.wall = this.labelService.setWall(this.sale.location.wall);
    this.sale.location.type_house = this.labelService.setTypeHouse(this.sale.location.type_house);

    this.getAllLabels();
    this.getAllLocations();
    this.getRegions();
    this.getDistrictsRb(this.sale.location.city.district_country.region.id);
    this.getStreets(this.sale.location.city.id);
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.access = data.array_access;
      this.getUsers();
    });

  }

  save() {

    this.sale.contract_from = new NgbDateFRParserFormatter().format_to_base(this.sale.contract_from);
    this.sale.contract_to = new NgbDateFRParserFormatter().format_to_base(this.sale.contract_to);

    this.sale.location.street.id = (this.sale.location.street.id !== undefined) ? this.sale.location.street.id : 0;

    this.sale.photo_reclame = this.upload_photo;
    console.log(this.sale);
    if (this.validation() === true) {

      if (this.sale.id !== 0) {
        this.saleService.update(this.sale).subscribe(
          data => {
            if (data) {

              if (data.sale.moderation)  {
                this.message('Объект отправлен на модерацию', false);
                this.sharedService.emitChange4(); // обновление модерации в меню
              } else {
                this.message('Объект успешно обновлен', false);
              }

              this.router.navigate(['sales']);
              // создание заявки если была введена неизвестная улица или автоматическая заявка
              // (новый дом на улице или в городе нет улицы - создана новая локация)
              if ((this.sale.location.city.id && this.sale.location.street.id === 0) || data.new_location === true) {
                this.sendRequest(data.location_id);
              }
            } else {
              this.message('Не удалось обновить объект!', true);

              this.sale.contract_from = new NgbDateFRParserFormatter().parse('' + this.sale.contract_from);
              this.sale.contract_to = new NgbDateFRParserFormatter().parse('' + this.sale.contract_to);
            }
          },
          error => {
            if (error.status === 401) {
              this.router.navigate(['']);
            } else {
              this.message('Ошибка!', true);

              this.sale.contract_from = new NgbDateFRParserFormatter().parse('' + this.sale.contract_from);
              this.sale.contract_to = new NgbDateFRParserFormatter().parse('' + this.sale.contract_to);
            }
          }
        );
      } else {

        this.saleService.create(this.sale).subscribe(
          data => {
            if (data) {

              if (data.sale.moderation)  {
                this.message('Объект отправлен на модерацию', false);
                this.sharedService.emitChange4(); // обновление модерации в меню
              } else {
                this.message('Объект успешно создан', false);
              }

              this.router.navigate(['sales']);

              this.idSaleRequest = data.sale.id; // id созданного sale
              // создание заявки если была введена неизвестная улица или автоматическая заявка
              // (новый дом на улице или в городе нет улицы - создана новая локация)
              if ((this.sale.location.city.id && this.sale.location.street.id === 0) || data.new_location === true) {
                this.sendRequest(data.location_id);
              }

            } else {
              this.message('Не удалось создать объект!', true);

              this.sale.contract_from = new NgbDateFRParserFormatter().parse('' + this.sale.contract_from);
              this.sale.contract_to = new NgbDateFRParserFormatter().parse('' + this.sale.contract_to);
            }
          },
          error => {
            if (error.status === 401) {
              this.router.navigate(['']);
            } else {
              this.message('Ошибка!', true);

              this.sale.contract_from = new NgbDateFRParserFormatter().parse('' + this.sale.contract_from);
              this.sale.contract_to = new NgbDateFRParserFormatter().parse('' + this.sale.contract_to);
            }
          }
        );
      }
    }
  }

  getAllLabels() {
    this.labelService.getAllLabelsSales().subscribe(data => {
      this.wc = data.wc;
      this.walls = data.walls;
      this.balconies = data.balconies;
      this.terraces = data.terraces;
      this.levels = data.levels;
      this.types = data.types;
      this.repairs = data.repairs;
      this.floors = data.floors;
      this.furniture = data.furniture;
      this.sales = data.sales;
      this.sources = data.sources;
    });
  }

  getAllLocations() {
    this.locationService.getAllLocations().subscribe(data => {
      this.metro = data.metro;
      this.regions = data.regions;
      this.districts_rb = data.districts_rb;
      this.cities = data.cities;
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
      this.selectDistrictsRb = [];
      for (let i = 0; i < options.length; i++) {
        this.selectDistrictsRb.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getCities(region = 0, district_rb: any = 0, title = '') {
    /* добавить в массив по фильтру более 3 символов*/
    if (title.length > 2) {
      this.locationService.getCities(region, district_rb, title).subscribe((options) => {
        this.selectCities = [];

        for (let i = 0; i < options.length; i++) {
          this.selectCities.push({label: options[i].title, value: '' + options[i].id});
        }
      });
    } else {
      this.selectCities = [];
    }
  }

  getStreets(city = 0, district = 0, microdistrict = 0) {
    this.locationService.getStreets(city, district, microdistrict).subscribe((options) => {
      this.selectStreets = [];
      /*if (options.length === 0) {
        this.displayReq = true;
      }*/
      for (let i = 0; i < options.length; i++) {
        this.selectStreets.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  district_rb(option: IOption) {
    this.getDistrictsRb(+`${option.value}`);
  }

  street(option: IOption) {
    this.getStreets(+`${option.value}`);
  }

/*  getLocation(option: IOption) {

    const district = this.cities.find(x => x.id === +`${option.value}`).district_id;
    if (district) {
      this.sale.location.city.district_country.id = district;

      const region = this.districts_rb.find(x => x.id === district).region_id;
      if (region) {
        this.sale.location.city.district_country.region.id = region;
      }
    }
  }*/

  setShowDistrictCountry () {
    this.show_district_country = true;
  }

  unsetShowDistrictCountry () {
    this.show_district_country = false;
  }

  setShowCity () {
    this.show_city = true;
  }

  unsetShowCity () {
    this.show_city = false;
  }

  setShowStreet () {
    this.show_street = true;
  }

  unsetShowStreet () {
    this.show_street = false;
  }

  getInfoLocation() {

    this.movieMapMarker = false;

    if (this.sale.location.street.id && this.sale.location.house) {

      this.search['city'] = this.sale.location.city.id;
      this.search['street'] = this.sale.location.street.id;
      this.search['house'] = (this.sale.location.house) ? this.sale.location.house : 0;
      this.search['housing'] = (this.sale.location.housing) ? this.sale.location.housing : 0;

      this.locationService.getLocation(this.search).subscribe((data) => {
        console.log(data);
        if (data) {
          this.sale.location.district = this.locationService.setDistrict(data.district);
          this.sale.location.microdistrict = this.locationService.setMicroDistrict(data.microdistrict);
          this.sale.location.metro = this.locationService.setMetro(data.metro);
          this.sale.location.wall = this.labelService.setWall(data.wall);
          this.sale.location.type_house = this.labelService.setWall(data.type_house);
          this.sale.location.year = data.year;
          this.sale.location.year_repair = data.year_repair;
          this.sale.location.coordinates = data.coordinates;

          this.movieMapMarker = true; // переместить метку на карте

        } else {
          this.sale.location.district = this.locationService.setDistrict(null);
          this.sale.location.microdistrict = this.locationService.setMicroDistrict(null);
          this.sale.location.metro = this.locationService.setMetro(null);
          this.sale.location.wall = this.labelService.setWall(null);
          this.sale.location.type_house = this.labelService.setTypeHouse(null);
          this.sale.location.year = 0;
          this.sale.location.year_repair = 0;
        }
      });

    } else {
      this.sale.location.district = this.locationService.setDistrict(null);
      this.sale.location.microdistrict = this.locationService.setMicroDistrict(null);
      this.sale.location.wall = this.labelService.setWall(null);
      this.sale.location.type_house = this.labelService.setTypeHouse(null);
      this.sale.location.year = 0;
      this.sale.location.year_repair = 0;
    }
  }

  /*proveCountStreet () {
    if (this.streets.length === 0) {
        this.displayReq = !this.displayReq;
      }
  }*/

  onFilterInputChanged(searchTerm) {
    this.sale.location.street.title = searchTerm;

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

  sendRequest(location_id = 0) {

    this.request['sale'] = (this.sale.id !== 0) ? this.sale.id : this.idSaleRequest;
    this.request['location'] = this.sale.location;
    this.request['location']['id'] = location_id;
    this.request['streetRequest'] = this.streetRequest;
    this.request['textRequest'] = this.textRequest;

    this.saleService.newLocationRequest(this.request).subscribe(data => {
      //  this.idRequest = data.request; // id добавляемой заявки

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
    this.sale.user = this.userService.setUser(this.users.find(u => u.id === +user));
    this.sale.user.manager_information = this.userService.setUserInformation(this.sale.user.manager_information);
  }

  /*Фото*/
  onUploadFinished(file: FileHolder) {
    const im = new Photo(file.src, '', '');
    this.upload_photo.push(im.path);
    this.sale.photo_reclame = this.upload_photo;
    //  console.log(this.upload_photo);
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
    this.sale.photo_reclame = this.upload_photo;
  }

  /*Конец Фото*/

  /* Валидация */
  validationRegion(): boolean {

    if (this.sale.location.city.district_country.region.id) {
      this.validation_region = true;
      this.message_region = '';

      return true;
    } else {
      this.validation_region = false;
      this.message_region = 'Обязательное поле';

      return false;
    }
  }

  validationCity(): boolean {
    if (this.sale.location.city.id) {
      this.validation_city = true;
      this.message_city = '';

      return true;
    } else {
      this.validation_city = false;
      this.message_city = 'Обязательное поле';

      return false;
    }
  }

  validationHouse(): boolean {
    if (+this.sale.location.house > 0) {
      this.validation_house = true;
      this.message_house = '';

      return true;
    } else {
      this.validation_house = false;
      this.message_house = 'Обязательное поле';

      return false;
    }
  }

  validationRoom(): boolean {
    if (this.sale.room > 0) {
      this.validation_room = true;
      this.message_room = '';

      return true;
    } else {
      this.validation_room = false;
      this.message_room = 'Обязательное поле';

      return false;
    }
  }

  validationArea(): boolean {
    if (this.sale.area > 0) {
      this.validation_area = true;
      this.message_area = '';

      return true;
    } else {
      this.validation_area = false;
      this.message_area = 'Обязательное поле';

      return false;
    }
  }

  validationAreaLeave(): boolean {
    if (this.sale.area_leave > 0) {
      this.validation_area_leave = true;
      this.message_area_leave = '';

      return true;
    } else {
      this.validation_area_leave = false;
      this.message_area_leave = 'Обязательное поле';

      return false;
    }
  }

  validationAreaKitchen(): boolean {
    if (this.sale.area_kitchen > 0) {
      this.validation_area_kitchen = true;
      this.message_area_kitchen = '';

      return true;
    } else {
      this.validation_area_kitchen = false;
      this.message_area_kitchen = 'Обязательное поле';

      return false;
    }
  }

  validationStorey(): boolean {
    if (this.sale.storey > 0) {
      this.validation_storey = true;
      this.message_storey = '';

      return true;
    } else {
      this.validation_storey = false;
      this.message_storey = 'Обязательное поле';

      return false;
    }
  }

  validationStoreys(): boolean {
    if (this.sale.storeys > 0) {
      this.validation_storeys = true;
      this.message_storeys = '';

      return true;
    } else {
      this.validation_storeys = false;
      this.message_storeys = 'Обязательное поле';

      return false;
    }
  }

  validationPrice(): boolean {
    if (this.sale.price > 0) {
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

    if (this.validationRegion() === true && this.validationCity() === true && this.validationHouse() === true && this.validationRoom() === true
      && this.validationArea() === true && this.validationAreaLeave() === true
      && this.validationAreaKitchen() === true && this.validationStorey() === true && this.validationStoreys() === true
      && this.validationPrice() === true) {
      return true;
    }
    return false;
  }

  /*  Конец валидации */
}
