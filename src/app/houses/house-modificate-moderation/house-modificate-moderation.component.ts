import {Component, OnInit} from '@angular/core';
import {IOption} from 'ng-select';
import {Photo} from '../../_models/Photo.model';
import {UserInformation} from '../../_models/UserInformation.model';
import {User} from '../../_models/User.model';
import {Label} from '../../_models/Label.model';
import {Metro} from '../../_models/Metro.model';
import {House} from '../../_models/House.model';

import {LabelService} from '../../_services/label.service';
import {LocationService} from '../../_services/location.service';
import {ImageService} from '../../_services/image.service';
import {SharedService} from '../../_services/shared.service';
import {LoginService} from '../../_services/login.service';
import {UserService} from '../../_services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HouseService} from '../../_services/house.service';

import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {FileHolder} from 'angular2-image-upload';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {AccessModel} from '../../_models/Access.model';

@Component({
  selector: 'app-house-modificate-moderation',
  templateUrl: './house-modificate-moderation.component.html',
  styleUrls: ['./house-modificate-moderation.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}
  ]
})
export class HouseModificateModerationComponent implements OnInit {

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
  public regions = [];
  public districts_rb = [];
  public cities = [];

  public house: House = new House(0, null, null, '', '', '', '',  '', null, null, false,
    '', 0, 0, false, false, false, false, 0, '', null, '',
    '', 0, null, 0, 0, 0, 0, 0, 0, 0, 0, null, 0, false, false,
    false, '', 0, 0, 0, 0, 0, 0, false, '', '', '', null, false, false,
    false, null, null, null,   null, false, false, false, false);

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
  public noResultsTerm = '';

  public movieMapMarker = false;

  // валидация
  public validation_region: any = true; // flag of variable (valid input data or not)
  public message_region: any;         // message text of invalid input data
  public validation_district: any = true; // flag of variable (valid input data or not)
  public message_district: any;         // message text of invalid input data
  public validation_city: any = true; // flag of variable (valid input data or not)
  public message_city: any;         // message text of invalid input data
  public validation_house: any = true; // flag of variable (valid input data or not)
  public message_house: any;         // message text of invalid input data
  public validation_area: any = true; // flag of variable (valid input data or not)
  public message_area: any;         // message text of invalid input data
  public validation_area_land: any = true; // flag of variable (valid input data or not)
  public message_area_land: any;         // message text of invalid input data
  public validation_type: any = true; // flag of variable (valid input data or not)
  public message_type: any;         // message text of invalid input data
  public validation_price: any = true; // flag of variable (valid input data or not)
  public message_price: any;         // message text of invalid input data

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private houseService: HouseService,
              private labelsService: LabelService,
              private locationService: LocationService,
              private userService: UserService,
              private imageService: ImageService,
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
            this.house = data.house;

            for (let i = 0; i < this.house.photo.length; i++) {
              this.upload_photo.push(this.house.photo[i].path);
              //  console.log(this.upload_photo);
            }
            this.house.contract_from = new NgbDateFRParserFormatter().parse(data.house.contract_from);
            this.house.contract_to = new NgbDateFRParserFormatter().parse(data.house.contract_to);

            if (this.house.contract) {
              const pos = this.house.contract.indexOf('/');
              if (pos !== -1) {
                this.house.contract_fraction = this.house.contract.substring(pos);
                this.house.contract = this.house.contract.substring(0, pos);
              } else {
                this.house.contract_fraction = '';
              }
            }

            if (data.house.type !== 0) {// для типа дома
              this.arrayTypes[data.house.type] = true;
              this.activeTypes = data.house.type;
            }

          });

          this.selectCities.push({label: this.house.location.city.title, value: '' + this.house.location.city.id});

        } else {
          this.selectCities = [];
        }
      });

    this.house.house_addition_information = this.houseService.setHouseAdditionInformation(this.house.house_addition_information);

    this.house.user = this.userService.setUser(this.house.user);
    this.house.user.user_information = this.userService.setUserInformation(this.house.user.user_information);
    this.house.user.manager_information = this.userService.setUserInformation(this.house.user.user_information);

    this.house.location = this.locationService.setLocation(this.house.location);
    this.house.location.city = this.locationService.setCity(this.house.location.city);
    this.house.location.city.district_country = this.locationService.setDistrictCountry(this.house.location.city.district_country);
    this.house.location.city.district_country.region = this.locationService.setRegion(this.house.location.city.district_country.region);
    this.house.location.district = this.locationService.setDistrict(this.house.location.district);
    this.house.location.microdistrict = this.locationService.setMicroDistrict(this.house.location.microdistrict);
    this.house.location.street = this.locationService.setStreet(this.house.location.street);
    this.house.location.metro = this.locationService.setMetro(this.house.location.metro);
    this.house.location.direction = this.locationService.setDirection(this.house.location.direction);

    this.getAllLabels();
    this.getAllLocations();

    this.getRegions();
    this.getDistrictsRb(this.house.location.city.district_country.region.id);
   // this.getCities(this.house.location.city.district_country.id);
    this.getStreets(this.house.location.city.id);
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.access = data.array_access;
      this.getUsers();

    });
  }

  getAllLocations() {
    this.locationService.getAllLocations().subscribe((data) => {
      this.metro = data.metro;
      this.regions = data.regions;
      this.districts_rb = data.districts_rb;
      this.cities = data.cities;
    });
  }

  getAllLabels() {
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

  city(option: IOption) {
    this.getCities(+`${option.value}`);
  }

  street(option: IOption) {
    this.getStreets(+`${option.value}`);
  }

  getLocation(option: IOption) {

    const district = this.cities.find(x => x.id === +`${option.value}`).district_id;
    if (district) {
      this.house.location.city.district_country.id = district;

      const region = this.districts_rb.find(x => x.id === district).region_id;
      if (region) {
        this.house.location.city.district_country.region.id = region;
      }
    }
  }

  getInfoLocation() {

    this.movieMapMarker = false;

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
          this.house.location.coordinates = data.coordinates;

          this.movieMapMarker = true; // переместить метку на карте

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
    this.house.user = this.userService.setUser(this.users.find(u => u.id === +user));
    this.house.user.manager_information = this.userService.setUserInformation(this.house.user.manager_information);
  }

  save() {
    this.house.contract_from = new NgbDateFRParserFormatter().format_to_base(this.house.contract_from);
    this.house.contract_to = new NgbDateFRParserFormatter().format_to_base(this.house.contract_to);

    this.house.location.street.id = (this.house.location.street.id !== undefined) ? this.house.location.street.id : 0;

    this.house.photo = this.upload_photo;

    if (this.validation() === true) {

      if (this.house.id !== 0) {
        this.houseService.returnModeration(this.house).subscribe(
          data => {

            if (data) {
              this.message('Объект перенесен в общую базу', false);
              this.router.navigate(['houses/moderation']);

            } else {
              this.message('Не удалось перенести объект!', true);

              this.house.contract_from = new NgbDateFRParserFormatter().parse('' + this.house.contract_from);
              this.house.contract_to = new NgbDateFRParserFormatter().parse('' + this.house.contract_to);
            }
          },
          error => {
            if (error.status === 401) {
              this.router.navigate(['']);
            } else {
              this.message('Ошибка!', true);

              this.house.contract_from = new NgbDateFRParserFormatter().parse('' + this.house.contract_from);
              this.house.contract_to = new NgbDateFRParserFormatter().parse('' + this.house.contract_to);
            }
          }
        );
      }
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

  /* Валидация */
  validationRegion(): boolean {

    if (this.house.location.city.district_country.region.id) {
      this.validation_region = true;
      this.message_region = '';

      return true;
    } else {
      this.validation_region = false;
      this.message_region = 'Обязательное поле';

      return false;
    }
  }

  validationDistrict(): boolean {

    if (this.house.location.city.district_country.id) {
      this.validation_district = true;
      this.message_district = '';

      return true;
    } else {
      this.validation_district = false;
      this.message_district = 'Обязательное поле';

      return false;
    }
  }

  validationCity(): boolean {
    if (this.house.location.city.id) {
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
    if (+this.house.location.house > 0) {
      this.validation_house = true;
      this.message_house = '';

      return true;
    } else {
      this.validation_house = false;
      this.message_house = 'Обязательное поле';

      return false;
    }
  }

  validationArea(): boolean {

    if (this.house.area > 0) {
      this.validation_area = true;
      this.message_area = '';

      return true;
    } else {
      if (!this.arrayTypes[119]) { // если не выбран участок
        this.validation_area = false;
        this.message_area = 'Обязательное поле';

        return false;
      } else {
        this.validation_area = true;
        this.message_area = '';

        return true;
      }
    }

  }

  validationAreaLand(): boolean {
    if (this.house.area_land > 0) {
      this.validation_area_land = true;
      this.message_area_land = '';

      return true;
    } else {
      this.validation_area_land = false;
      this.message_area_land = 'Обязательное поле';

      return false;
    }
  }

  validationType(): boolean {
    if (this.arrayTypes.length > 0) {
      this.validation_type = true;
      this.message_type = '';

      return true;
    } else {
      this.validation_type = false;
      this.message_type = 'Выберите тип объекта';

      return false;
    }
  }

  validationPrice(): boolean {
    if (this.house.price > 0) {
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

    if (this.validationRegion() === true && this.validationDistrict() && this.validationCity() === true
      && this.validationType() === true && this.validationAreaLand() === true && this.validationArea() === true
      && this.validationPrice() === true) {
      return true;
    }
    return false;
  }

  /*  Конец валидации */

}
