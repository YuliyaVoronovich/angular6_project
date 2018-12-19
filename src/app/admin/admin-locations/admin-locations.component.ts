import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../_services/shared.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {Location} from '../../_models/Location.model';
import {LocationService} from '../../_services/location.service';
import {RequestService} from '../../_services/request.service';

import {IOption} from 'ng-select';
import {Label} from '../../_models/Label.model';
import {LabelService} from '../../_services/label.service';
import {Region} from '../../_models/Region.model';
import {DistrictCountry} from '../../_models/DistrictCountry.model';
import {City} from '../../_models/City.model';
import {Street} from '../../_models/Street.model';
import {District} from '../../_models/District.model';
import {Microdistrict} from '../../_models/Microdistrict.model';
import {Request} from '../../_models/Request.model';

import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SaleService} from '../../_services/sale.service';
import {Sale} from '../../_models/Sale.model';
import {Direction} from '../../_models/Direction.model';
import {House} from '../../_models/House.model';
import {HouseService} from '../../_services/house.service';


@Component({
  selector: 'app-admin-locations',
  templateUrl: './admin-locations.component.html',
  styleUrls: ['./admin-locations.component.css']
})


export class AdminLocationsComponent implements OnInit {

  /*  public myControl = new FormControl();
    public myControl2 = new FormControl();
    public myControl3 = new FormControl();
    public myControl4 = new FormControl();*/
  locationForm: FormGroup;

  public regionsSelect: any[] = [];
  public filteredRegions: Observable<string[]>;
  public districts_rbSelect: any[] = [];
  public filteredDistricts: Observable<string[]>;
  public citiesSelect: any[] = [];
  public filteredCities: Observable<string[]>;
  public streetsSelect: any[] = [];
  public filteredStreets: Observable<string[]>;

  public timer: any;
  public locations: Location [] = [];
  public location: Location = new Location(0, null, null, null, null, null, null, '0', '0', null,
    '', 0, 0, 0, 0, null, '');
  public region: Region = new Region(0, null);
  public district_country: DistrictCountry = new DistrictCountry(0, null, '');
  public street: Street = new Street(0, '', null);
  public city = new City(0, null, '');
  public district: District = new District(0, null, '', '', '');
  public microdistrict: Microdistrict = new Microdistrict(0, null, '', '');
  public direction: Direction = new Direction(0, null, '');

  public sale: Sale = new Sale(0, null, null, '', '', '', 0, 0, false,
    '', false, false, false, '', '', null, null,  false, '', null,
    '', 0, 0, 0, 0, 0, 0, '', 0, 0, 0, false, false, false, 0,
    0, 0, 0, 0, '', 0, false, '', '', false, 0, 0, null,
    null, null, null,  false, false, false, null, null, null,
    false, false, false, false);

  public house: House = new House(0, null, null, '', '', '', '',  '', null, null, false,
    '', 0, 0, false, false, false, false, 0, '', null, '',
    '', 0, null, 0, 0, 0, 0, 0, 0, 0, 0, null, 0, false, false,
    false, '', 0, 0, 0, 0, 0, 0, false, '', '', '', null, false, false,
    false, null, null, null, false, false, false, false);

  public request: Request = new Request(0, '', '', 1);

  public walls: Label[] = [];
  public types: Label[] = [];

  public regions = [];
  public districts_rb = [];
  public cities = [];
  public streets = [];
  public districts = [];
  public microdistricts = [];
  public directions = [];

  public search = {};
  public idObject = 0;
  public typeObject = '';
  public idRequest;
  public deleteRequest = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private locationService: LocationService,
              private labelsService: LabelService,
              private requestService: RequestService,
              private saleService: SaleService,
              private houseService: HouseService,
              private sharedService: SharedService) {
  }


  ngOnInit() {

    this.initForm();

    this.getRegions();
    this.getDistrictsRb();
    this.getCities();
    this.getStreets();
    this.getAllLocations();

    /*setTimeout(() => {
      this.getAutocomplit();
    }, 1000);*/
    this.labelsService.getAllLabelsSales().subscribe(data => {
      this.walls = data.walls;
      this.types = data.types;
    });
    this.location.district_country = this.district_country;
    this.location.region = this.region;
    this.location.city = this.city;
    this.location.street = this.street;
    this.location.district = this.district;
    this.location.microdistrict = this.microdistrict;
    this.location.direction = this.direction;
  }

  initForm() {
    this.locationForm = this.fb.group({
      region: Region,
      district_country: DistrictCountry,
      city: City,
      street: Street,
      house: 0,
      housing: 0,
      district: District,
      microdistrict: Microdistrict,
      direction: Direction,
      wall: Label,
      type_house: Label,
      year: 0,
      year_repair: 0
    });
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

  private _filter(array, value: string): string[] {
    const filterValue = value;

    return array.filter(option => option.title.toLowerCase().includes(filterValue));
  }

  getAutocomplit() {
    this.autoComplitRegion();
    this.autoComplitDistrict();
    this.autoComplitCities();
    this.autoComplitStreets();
  }

  autoComplitRegion() {
    this.filteredRegions = this.locationForm.controls['region'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(this.regionsSelect, value))
      );
  }

  autoComplitDistrict() {
    this.filteredDistricts = this.locationForm.controls['district_country'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(this.districts_rbSelect, value))
      );
  }

  autoComplitCities() {
    this.filteredCities = this.locationForm.controls['city'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(this.citiesSelect, value))
      );
  }

  autoComplitStreets() {
    this.filteredStreets = this.locationForm.controls['street'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(this.streetsSelect, value))
      );
  }

  public valueRegion = (key) => {
    //  console.log(key.id);
    const selection = this.regionsSelect.find(e => e.id === key.id);

    if (selection) {
      return selection.title;
    }
  };

  public valueDistrict = (key) => {
    const selection = this.districts_rbSelect.find(e => e.id === key.id);
    if (selection) {
      return selection.title;
    }
  };

  public valueCity = (key) => {
    const selection = this.citiesSelect.find(e => e.id === key.id);
    if (selection) {
      return selection.title;
    }
  };

  public valueStreet = (key) => {
    const selection = this.streetsSelect.find(e => e.id === key.id);
    if (selection) {
      return selection.title;
    }
  };

  getAllLocations() {
    this.locationService.getAllLocations().subscribe((data) => {
      this.regions = data.regions;
      this.districts_rb = data.districts_rb;
      this.cities = data.cities;
      this.districts = data.districts;
      this.streets = data.streets;
      this.microdistricts = data.microdistricts;
      this.directions = data.directions;
    });
  }

  getRegions() {
    this.regionsSelect = [];

    this.locationService.getRegions().subscribe((options) => {
      for (let i = 0; i < options.length; i++) {
        this.regionsSelect.push(options[i]);
      }
      this.autoComplitRegion();
    });
  }

  getDistrictsRb(region = 0) {
    this.districts_rbSelect = [];

    this.locationService.getDistrictsRb(region).subscribe((options) => {
      for (let i = 0; i < options.length; i++) {
        this.districts_rbSelect.push(options[i]);

      }
      this.autoComplitDistrict();
    });
  }

  getCities(region = 0, districts_rb = 0) {
    this.citiesSelect = [];

    this.locationService.getCities(region, districts_rb).subscribe((options) => {
      for (let i = 0; i < options.length; i++) {
        this.citiesSelect.push(options[i]);
      }
      this.autoComplitCities();
    });
  }

  getStreets(city = 0, district = 0, microdistrict = 0) {
    this.streetsSelect = [];

    this.locationService.getStreets(city, district, microdistrict).subscribe((options) => {
      for (let i = 0; i < options.length; i++) {
        this.streetsSelect.push(options[i]);
      }
      this.autoComplitStreets();
    });
  }

  getLocation(option) {

    const district = this.cities.find(x => x.id === option.id).district_id;
    // уже выбран район и область
    const district_value = this.locationForm.controls['district_country'].value.id;

    if (!district_value) {
      if (district) {
        // this.locationForm.get('district_rb').setValue(district);
        this.locationForm.controls['district_country'].patchValue({id: district});
        // this.location.district_country.id = district;

        const region = this.districts_rb.find(x => x.id === district).region_id;
        if (region) {
          this.locationForm.controls['region'].patchValue({id: region});
          //  this.location.region.id = region;
        }
      }
    }
  }

  clear() {
    if (this.locationForm.controls['city'].value === '') {
      this.locationForm.controls['district_rb'].patchValue({id: 0});
      this.locationForm.controls['region'].patchValue({id: 0});
    }
  }

  getDistrict(option) {
    this.getDistrictsRb(option.id);
  }

  getCity(option) {
    this.getCities(0, option.id);
  }

  getStreet(option) {
    this.getStreets(option.id);
  }

  getInfoLocation() {

    if (this.locationForm.controls['street'].value && this.locationForm.controls['house'].value) {

      this.search['city'] = this.locationForm.controls['city'].value.id;
      this.search['street'] = this.locationForm.controls['street'].value.id;
      this.search['house'] = this.locationForm.controls['house'].value;
      this.search['housing'] = this.locationForm.controls['housing'].value;

      this.locationService.getLocation(this.search).subscribe((data) => {
        console.log(data);

        this.location = this.locationService.setLocation(data);
        this.location.city = this.locationService.setCity(this.location.city);
        this.location.city.district_country = this.locationService.setDistrictCountry(this.location.city.district_country);
        this.location.city.district_country.region = this.locationService.setRegion(this.location.city.district_country.region);
        this.location.street = this.locationService.setStreet(this.location.street);
        this.location.district = this.locationService.setDistrict(this.location.district);

        this.location.microdistrict = this.locationService.setMicroDistrict(this.location.microdistrict);
        this.location.direction = this.locationService.setDirection(this.location.direction);

        this.location.house = this.locationForm.controls['house'].value;
        this.location.housing = this.locationForm.controls['housing'].value;
        if (!data) {
          this.location.id = 0;
          this.location.wall = 0;
          this.location.type_house = 0;
          this.location.year = 0;
          this.location.year_repair = 0;
        }

      });
    }
  }

  onSubmit() {

    this.location.region = this.locationForm.controls['region'].value;
    this.location.district_country = this.locationForm.controls['district_country'].value;
    this.location.city = this.locationForm.controls['city'].value;
    this.location.street = this.locationForm.controls['street'].value;
    this.location.direction = this.locationForm.controls['direction'].value;
    console.log(this.location);

    if (this.location.id !== 0) {
      this.locationService.update(this.location).subscribe(
        data => {
          if (data.status === 200) {
            this.message('Адрес был успешно обновлен', false);
            // удалить заявку
            this.deleteRequest = true;
          } else {
            this.message('Ошибка обновления адреса!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка обновления адреса!', true);
          }
        }
      );
    } else {
      this.locationService.create(this.location).subscribe(
        data => {

          if (data) {
            this.message('Адрес был успешно добавлен', false);

            this.getUpdateObject(data);
          } else {
            this.message('Ошибка добавления адреса!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка добавления адреса!', true);
          }
        }
      );
    }
  }

  getUpdateObject(data) {
    // обновить sale location_id
    if (this.idObject && this.typeObject === 'sales') {
      this.sale['id'] = this.idObject;
      this.sale['location_request'] = data;
      this.saleService.update(this.sale).subscribe(
        data1 => {
          // удалить заявку
          this.deleteRequest = true;
          console.log(this.deleteRequest);
        });
    }
    // обновить house location_id
    if (this.idObject && this.typeObject === 'houses') {
      this.house['id'] = this.idObject;
      this.house['location_request'] = data;
      this.houseService.update(this.house).subscribe(
        data1 => {
          // удалить заявку
          this.deleteRequest = true;
          console.log(this.deleteRequest);
        });
    }

  }

  getRequest(event) {

    this.deleteRequest = false;

    if (event.info.sales) {
      this.idObject = event.info.sales;
      this.typeObject = 'sales';

    } else if (event.info.houses) {
      this.idObject = event.info.houses;
      this.typeObject = 'houses';
    }
    // сделать выбор вида объект квартиры-дома-аренда
    this.request = event;

    this.locationForm.controls['region'].patchValue({id: +event.info.region});
    this.locationForm.controls['city'].patchValue({id: +event.info.city});
    this.getStreets(event.info.city);
    this.locationForm.controls['street'].patchValue({id: +event.info.street});
    this.locationForm.controls['house'].patchValue(event.info.house);
    this.locationForm.controls['housing'].patchValue(event.info.housing);

    this.getInfoLocation();
  }

}
