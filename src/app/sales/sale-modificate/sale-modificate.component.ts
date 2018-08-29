import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Sale} from '../../_models/sale.model';
import {Label} from '../../_models/label.model';
import {Region} from '../../_models/region.model';
import {Metro} from '../../_models/metro.model';
import {SaleAdditionInformation} from '../../_models/saleAdditionInformation.model';

import {LoginService} from '../../_services/login.service';
import {SaleService} from '../../_services/sale.service';
import {LabelService} from '../../_services/label.service';
import {LocationService} from '../../_services/location.service';

import {NgbDatepickerConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {IOption} from 'ng-select';
import {SharedService} from '../../_services/shared.service';
import {UserService} from '../../_services/user.service';
import {User} from '../../_models/user.model';
import {UserInformation} from '../../_models/userInformation.model';
import {Subscription} from 'rxjs/index';
import {Photo} from '../../_models/photo.model';
import {FileHolder} from 'angular2-image-upload';


@Component({
  selector: 'app-sale-modificate',
  templateUrl: './sale-modificate.component.html',
  styleUrls: ['./sale-modificate.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}
  ]
})


export class SaleModificateComponent implements OnInit {

  public regions: Array<IOption> = [
    {label: '', value: ''}
  ];

  public cities: Array<IOption> = [
    {label: '', value: ''}
  ];

  public streets: Array<IOption> = [
    {label: '', value: ''}
  ];

  public wc: Label[] = [];
  public walls: Label[] = [];
  public balconies: Label[] = [];
  public terraces: Label[] = [];
  public levels: Label[] = [];
  public types: Label[] = [];
  public repairs: Label[] = [];
  public floors: Label[] = [];
  public furnitures: Label[] = [];
  public sales: Label[] = [];
  public sources: Label[] = [];
  public metro: Metro[] = [];

  public sale: Sale = new Sale(0, null, '', '', '', 0,  0, false,
    '', false, false, false, '', null, null, '', '', '', null,
    0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, false, false, 0,
    0, 1, '', 1, 1, '', 1, false, '', '', false, 0, 1, null,
    null, null, null, false, null, null, null);

  public sale_addition_information = new SaleAdditionInformation(0, false
    , false, false, false, false, false, false, false, false, false, false
    , false, false, false, false, false, false, false, false, false, false
    , false, false, false, false, false, false, false);

  public user: User = new User(0, '', '', null, null, null, '',
    0, 0, 0, null, null, null, null, null);
  public user_information: UserInformation = new UserInformation(0, '', '', '', '', '', '', null, []);
  public users: User[] = [];

  public dogovor_from;
  public dogovor_to;

  public images: Photo [] = [];
  public upload_photo = [];

  public search = {
    'company': 0
  };

  public timer: any;

  public displayReq = false;
  public noResultsTerm = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private saleService: SaleService,
              private labelsService: LabelService,
              private locationService: LocationService,
              private userService: UserService,
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
            this.sale = data.sale;
            if (this.sale.user === null) {
              this.sale.user = this.user;
            }
            if (this.sale.sale_addition_information !== null) {
              this.sale_addition_information = data.sale.sale_addition_information;
            }

            this.sale.dogovor_from = new NgbDateFRParserFormatter().parse(data.sale.dogovor_from);
            this.sale.dogovor_to = new NgbDateFRParserFormatter().parse(data.sale.dogovor_to);
          });
        } else {
          this.sale.sale_addition_information = this.sale_addition_information;
          this.sale.user = this.user;
        }
      });

    this.sale.location = this.locationService.setLocation(this.sale.location);
    this.sale.location.city = this.locationService.setCity(this.sale.location);
    this.sale.location.city.district_country = this.locationService.setDistrictCountry(this.sale.location);
    this.sale.location.city.district_country.region = this.locationService.setRegion(this.sale.location);
    this.sale.location.district = this.locationService.setDistrict(this.sale.location);
    this.sale.location.microdistrict = this.locationService.setMicroDistrict(this.sale.location);
    this.sale.location.street = this.locationService.setStreet(this.sale.location);
    this.sale.location.metro = this.locationService.setMetro(this.sale.location);


    this.labelsService.getAllLabels().subscribe(data => {
      this.wc = data.wc;
      this.walls = data.walls;
      this.balconies = data.balconies;
      this.terraces = data.terraces;
      this.levels = data.levels;
      this.types = data.types;
      this.repairs = data.repairs;
      this.floors = data.floors;
      this.furnitures = data.furnitures;
      this.sales = data.sales;
      this.sources = data.sources;
    });
    this.locationService.getAllLocations().subscribe(data => {
      this.metro = data.metro;
    });

    this.getRegions();
    this.getCities(this.sale.location.city.district_country.region.id);
    this.getStreets(this.sale.location.city.id);
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.getUsers();

    });

  }

  save() {
    console.log(this.sale);

    this.dogovor_from = new NgbDateFRParserFormatter().format_to_base(this.sale.dogovor_from);
    this.dogovor_to = new NgbDateFRParserFormatter().format_to_base(this.sale.dogovor_to);
    this.sale.dogovor_from = this.dogovor_from;
    this.sale.dogovor_to = this.dogovor_to;

    if (this.sale.id !== 0) {
      this.saleService.update(this.sale).subscribe(
        data => {
          if (data.status === 200) {
            this.message('Объект успешно обновлен', false);
            this.router.navigate(['sales']);
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
      this.saleService.create(this.sale).subscribe(
        data => {
          if (data.status === 201) {
            this.message('Объект успешно создан', false);
            this.router.navigate(['sales']);
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


  getRegions() {
    this.locationService.getRegions().subscribe((options) => {
      this.regions = [];
      for (let i = 0; i < options.length; i++) {
        this.regions.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getCities(region = 0) {
    this.locationService.getCities(region).subscribe((options) => {
      this.cities = [];
      for (let i = 0; i < options.length; i++) {
        this.cities.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getStreets(city = 0) {
    this.locationService.getStreets(city).subscribe((options) => {
      this.streets = [];
      for (let i = 0; i < options.length; i++) {
        this.streets.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  city(option: IOption) {
    this.getCities(+`${option.value}`);
  }

  street(option: IOption) {
    this.getStreets(+`${option.value}`);
  }

  onFilterInputChanged(searchTerm) {
    this.noResultsTerm = '';

    setTimeout(() => {
      if (this.noResultsTerm === '') {
        this.displayReq = false;
      } else {
        this.displayReq = true;
      }
    }, 150);

  }

  onNoOptionsFound(searchTerm) {
    setTimeout(() => {
      this.noResultsTerm = searchTerm;
    }, 100);
  }

  sendRequest(textRequest) {
    console.log(textRequest);
    console.log(this.sale);

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


  onUploadFinished(file: FileHolder) {
    const im = new Photo(file.src, '', '');
    this.upload_photo.push(im.path);
    this.sale.photo_reclame = this.upload_photo;
    //  console.log(this.upload_photo);
  }
  onRemoved (file: FileHolder) {

  }
}
