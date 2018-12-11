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

  public selectRegions: Array<IOption> = [
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
    '', false, false, false, '', '', null, null,  false, '', null,
    '', 0, 0, 0, 0, 0, 0, '', 0, 0, 0, false, false, false, 0,
    0, 0,  0, 0, '', 0, false, '', '', false, 0, 0, null,
    null, null, null,  false, false, false, null, null, null,
    false, false, false, false);

  public user: User = new User(0, '', '', null, null, null, '',
    0, 0, 0, false, null, null, null, null, null, null);
  public user_information: UserInformation = new UserInformation(0, '', '', '', '', '', '', null, []);
  public users: User[] = [];

  public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false);

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

  public movieMapMarker = false;

  public noResultsTerm = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private saleService: SaleService,
              private labelsService: LabelService,
              private locationService: LocationService,
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

  setNgbDate() {

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

        } else {
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

    this.getAllLabels();
    this.getAllLocations();
    this.getRegions();
    this.getCities(this.sale.location.city.district_country.region.id);
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

    if (this.sale.id !== 0) {
      this.saleService.update(this.sale).subscribe(
        data => {
          if (data) {
            this.message('Объект успешно обновлен', false);
            this.router.navigate(['sales']);
            // создание заявки если была введена неизвестная улица или автоматическая заявка
            // (новый дом на улице или в городе нет улицы - создана новая локация)
            if ((this.sale.location.city.id && this.sale.location.street.id === 0) || data.new_location === true) {
              this.sendRequest();
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
            this.message('Объект успешно создан', false);
            this.router.navigate(['sales']);

            this.idSaleRequest = data.sale.id; // id созданного sale
            // создание заявки если была введена неизвестная улица или автоматическая заявка
            // (новый дом на улице или в городе нет улицы - создана новая локация)
            if ((this.sale.location.city.id && this.sale.location.street.id === 0) || data.new_location === true) {
              this.sendRequest();
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

  getAllLabels() {
    this.labelsService.getAllLabelsSales().subscribe(data => {
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

  getCities(region = 0) {
    this.locationService.getCities(region).subscribe((options) => {
      this.selectCities = [];
      for (let i = 0; i < options.length; i++) {
        this.selectCities.push({label: options[i].title, value: '' + options[i].id});
      }
    });
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

  city(option: IOption) {
    this.getCities(+`${option.value}`);
  }

  street(option: IOption) {
    this.getStreets(+`${option.value}`);
  }

  getLocation(option: IOption) {

    const district = this.cities.find(x => x.id === +`${option.value}`).district_id;
    if (district) {
      this.sale.location.city.district_country.id = district;

      const region = this.districts_rb.find(x => x.id === district).region_id;
      if (region) {
        this.sale.location.city.district_country.region.id = region;
      }
    }
  }

  getInfoLocation() {

    this.movieMapMarker = false;

    if (this.sale.location.street.id && this.sale.location.house) {

      this.search['city'] = this.sale.location.city.id;
      this.search['street'] = this.sale.location.street.id;
      this.search['house'] = (this.sale.location.house) ? this.sale.location.house : 0;
      this.search['housing'] = (this.sale.location.housing) ? this.sale.location.housing : 0;

      this.locationService.getLocation(this.search).subscribe((data) => {
        //  console.log(data);
        if (data) {
          this.sale.location.district = this.locationService.setDistrict(data.district);
          this.sale.location.microdistrict = this.locationService.setMicroDistrict(data.microdistrict);
          this.sale.location.metro = this.locationService.setMetro(data.metro);
          this.sale.location.type_house = data.type_house;
          this.sale.location.year = data.year;
          this.sale.location.year_repair = data.year_repair;
          this.sale.location.coordinates = data.coordinates;

          this.movieMapMarker = true; // переместить метку на карте

        } else {
          this.sale.location.district = this.locationService.setDistrict(null);
          this.sale.location.microdistrict = this.locationService.setMicroDistrict(null);
          this.sale.location.metro = this.locationService.setMetro(null);
          this.sale.location.wall = 0;
          this.sale.location.type_house = 0;
          this.sale.location.year = 0;
          this.sale.location.year_repair = 0;
        }
      });

    } else {
      this.sale.location.district = this.locationService.setDistrict(null);
      this.sale.location.microdistrict = this.locationService.setMicroDistrict(null);
      this.sale.location.wall = 0;
      this.sale.location.type_house = 0;
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

  sendRequest() {

    this.request['sale'] = (this.sale.id !== 0) ? this.sale.id : this.idSaleRequest;
    this.request['location'] = this.sale.location;
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
    this.sale.user = this.userService.setUser(this.users.find(u => u.id === +user));
    this.sale.user.manager_information = this.userService.setUserInformation(this.sale.user.manager_information);
  }


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
}
