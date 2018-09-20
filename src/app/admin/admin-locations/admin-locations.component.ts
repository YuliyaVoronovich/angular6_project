import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../_services/shared.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {Location} from '../../_models/location.model';
import {LocationService} from '../../_services/location.service';
import {RequestService} from '../../_services/request.service';

import {IOption} from 'ng-select';
import {Label} from '../../_models/label.model';
import {LabelService} from '../../_services/label.service';
import {Region} from '../../_models/region.model';
import {DistrictCountry} from '../../_models/districtCountry.model';
import {City} from '../../_models/city.model';
import {Street} from '../../_models/street.model';
import {District} from '../../_models/district.model';
import {Microdistrict} from '../../_models/microdistrict.model';
import {Request} from '../../_models/request.model';

import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import {FormBuilder, FormGroup} from '@angular/forms';


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
    '', 0, 0, 0, 0, '');
  public region: Region = new Region(0, null);
  public district_country: DistrictCountry = new DistrictCountry(0, null, '');
  public street: Street = new Street(0, '', null);
  public city = new City(0, null, '');
  public district: District = new District(0, null, null, '');
  public microdistrict: Microdistrict = new Microdistrict(0, null, null, '');

  public walls: Label[] = [];
  public types: Label[] = [];

  public regions = [];
  public districts_rb = [];
  public cities = [];
  public streets = [];
  public districts = [];
  public microdistricts = [];

  public search = {};
  public idSale = 0;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private locationService: LocationService,
              private labelsService: LabelService,
              private requestService: RequestService,
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
    this.labelsService.getAllLabels().subscribe(data => {
      this.walls = data.walls;
      this.types = data.types;
    });
    this.location.district_country = this.district_country;
    this.location.region = this.region;
    this.location.city = this.city;
    this.location.street = this.street;
    this.location.district = this.district;
    this.location.microdistrict = this.microdistrict;
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

  getStreets(city = 0, microdistrict = 0) {
    this.streetsSelect = [];

    this.locationService.getStreets(city, microdistrict).subscribe((options) => {
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

      this.search['street'] = this.locationForm.controls['street'].value.id;
      this.search['house'] = this.locationForm.controls['house'].value;
      this.search['housing'] = this.locationForm.controls['housing'].value;

      this.locationService.getLocation(this.search).subscribe((data) => {
        console.log(data);
        if (data) {
          this.location = data;

          if (data.city.district_country.region) {
            this.location.region = data.city.district_country.region;
          } else {
            this.location.region = this.region;
          }
          if (data.city.district_country) {
            this.location.district_country = data.city.district_country;
          } else {
            this.location.district_country = this.district_country;
          }
          if (!data.city) {
            this.location.city = this.city;
          }
          if (!data.street) {
            this.location.street = this.street;
          }
          if (!data.district) {
            this.location.district = this.district;
          }
          if (!data.microdistrict) {
            this.location.microdistrict = this.microdistrict;
          }
        } else {
          this.location.district_country = this.district_country;
          this.location.region = this.region;
          this.location.city = this.city;
          this.location.street = this.street;
          this.location.district = this.district;
          this.location.microdistrict = this.microdistrict;

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
    this.location.region =  this.locationForm.controls['region'].value;
    this.location.district_country =  this.locationForm.controls['district_country'].value;
    this.location.city =  this.locationForm.controls['city'].value;
    this.location.street =  this.locationForm.controls['street'].value;
    console.log(this.location);

    if (this.idSale) {
      console.log(this.idSale);
      // обновить sale location_id
    }


    if (this.location.id !== 0) {
      this.locationService.update(this.location).subscribe(
        data => {
          if (data.status === 200) {
            this.message('Адрес был успешно обновлен', false);
            this.router.navigate(['admin/locations']);
          } else {
            this.message('Ошибка обновления компании!', true);
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
          if (data.status === 201) {
            this.message('Адрес был успешно добавлен', false);
            this.router.navigate(['admin/locations']);
          } else {
            this.message('Ошибка добавления адреса!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка добавления компании!', true);
          }
        }
      );
    }
  }
  getRequest(event) {
    console.log(event);
    this.idSale = event.info.sale;

    this.locationForm.controls['region'].patchValue({id: +event.info.region});
    this.locationForm.controls['city'].patchValue({id: +event.info.city});
    this.locationForm.controls['street'].patchValue({id: +event.info.street});
    this.locationForm.controls['house'].patchValue(event.info.house);
    this.locationForm.controls['housing'].patchValue(event.info.housing);
  }

}
