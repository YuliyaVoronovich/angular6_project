import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../_models/User.model';
import {Company} from '../../_models/Company.model';
import {House} from '../../_models/House.model';
import {Subscription} from 'rxjs/index';
import {Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {CompanyService} from '../../_services/company.service';
import {UserService} from '../../_services/user.service';
import {LocationService} from '../../_services/location.service';
import {SharedService} from '../../_services/shared.service';
import {HouseService} from '../../_services/house.service';
import {LabelService} from '../../_services/label.service';
import {SearchHouseModel} from '../../_models/SearchHouse.model';

import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AccessModel} from '../../_models/Access.model';

export interface DialogData {
  house: House;
}

@Component({
  selector: 'app-houses-list-delete',
  templateUrl: './houses-list-delete.component.html',
  styleUrls: ['./houses-list-delete.component.css']
})
export class HousesListDeleteComponent implements OnInit, OnDestroy {

  public houses: House[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);
  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, null);

  public hideme = [];
  public hideme2 = [];
  public hideme3 = [];
  public activeTypes = null;

  public page = 0;
  public timer: any;
  public countHouses; // если не придет информация с API
  public limit; // если не придет информация с API
  public count_delete = 0;
  public subscription: Subscription;

  public search = new SearchHouseModel({'values': [], 'except': 0}, {'values': [], 'except': 0},
    {'values': [], 'except': 0}, {'values': [], 'except': 0}, {'values': [], 'except': 0},
    {'values': [], 'except': 0}, '', null, null, null, null,
    '', '', '', '', '', '', '', '',
    '', '', [], [], [], [], '', '', [], [],
    [], [], false, false, false, false, false, false);


  public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false);

  public sort = {
    'field': 'created_at',
    'value': 'DESC'
  };

  constructor(public dialog: MatDialog,
              private route: Router,
              private houseService: HouseService,
              private locationService: LocationService,
              private labelsService: LabelService,
              private loginService: LoginService,
              private userService: UserService,
              private companyService: CompanyService,
              private sharedService: SharedService) {

    this.subscription = sharedService.changeEmitted$2.subscribe(data => {
      this.houses = [];
      this.user = data;
      this.getHouses();
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

  ngOnInit() {
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.access = data.array_access;

      this.getHouses();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeSort(field, value) {
    this.sort.field = field;
    this.sort.value = value;

    this.houses = [];

    this.getHouses();
  }

  getHousesByPage(page) {
    this.houses = [];
    this.page = page;
    this.search['page'] = this.page - 1;
    this.getHouses();
  }

  getHouses() {
    this.search['sort'] = JSON.stringify(this.sort);

    return this.houseService.getHousesDelete(this.search).subscribe(data => {

      this.houseService.countHousesDelete(this.search).subscribe(data1 => {
        this.limit = data1.limit;
        this.countHouses = data1.count;
      });

      for (let i = 0; i < data.length; i++) {
        // информация о сотруднике компании
        data[i].user = this.userService.setUser(data[i].user);
        data[i].user.user_information = this.userService.setUserInformation(data[i].user.user_information);
        data[i].company = this.companyService.setCompany(data[i].company);
        //
        // адрес объекта
        data[i].location = this.locationService.setLocation(data[i].location);
        data[i].location.city = this.locationService.setCity(data[i].location.city);
        data[i].location.city.district_country = this.locationService.setDistrictCountry(data[i].location.city.district_country);
        data[i].location.city.district_country.region = this.locationService.setRegion(data[i].location.city.district_country.region);
        data[i].location.district = this.locationService.setDistrict(data[i].location.district);
        data[i].location.microdistrict = this.locationService.setMicroDistrict(data[i].location.microdistrict);
        data[i].location.street = this.locationService.setStreet(data[i].location.street);
        data[i].location.metro = this.locationService.setMetro(data[i].location.metro);
        data[i].location.direction = this.locationService.setDirection(data[i].location.direction);

        // labels
        data[i].type = this.labelsService.setTypeHouse(data[i].type);
        data[i].roof = this.labelsService.setRoofHouse(data[i].roof);

        // цена за метр
        if (data[i].area !== null && data[i].area !== 0) {
          data[i].price_sqr = Math.floor(+data[i].price / +data[i].area);
        } else {
          data[i].price_sqr = 0;
        }
        //
        this.houses.push(data[i]);
      }
    }, error => {
      if (error.status === 401) {
        this.loginService.logout();
        this.route.navigate(['/']);
      }
      if (error.status === 403) {
        this.route.navigate(['403']);
      }
    });
  }

}
