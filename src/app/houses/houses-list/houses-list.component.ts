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
import {CalculatorComponent} from '../../_common/calculator/calculator.component';
import {SiteService} from '../../_services/site_service';
import {SiteModel} from '../../_models/Site.model';

export interface DialogData {
  house: House;
  sites: SiteModel[];
}

@Component({
  selector: 'app-house-list',
  templateUrl: './houses-list.component.html',
  styleUrls: ['./houses-list.component.css']
})
export class HousesListComponent implements OnInit, OnDestroy {

  public houses: House[] = [];
  public sites: SiteModel[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);
  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, [], null);

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
    '', '', [], [], [], [], '', '', '', [], [],
    [], [], false, false, false, false, false, false, false);

  public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false);

  public sort = {
    'field': 'updated_at',
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
              private sharedService: SharedService,
              private siteService: SiteService) {

    this.subscription = sharedService.changeEmitted$2.subscribe(data => {
      this.houses = [];
      this.user = data;
      this.getHouses();
      this.getSites();
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

  regExp (data) {
    return data.replace(new RegExp('&quot;', 'gm'), '"');
  }

  ngOnInit() {
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.access = data.array_access;

      this.getHouses();
      this.getSites();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getHousesSearch(event) {
    this.houses = [];

    for (const [key, value] of Object.entries(event)) {
      if (typeof(value) === 'object') {
        this.search[key] = JSON.stringify(event[key]);
      } else {
        this.search[key] = event[key];
      }

    }
    this.getHouses();
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

    return this.houseService.getHouses(this.search).subscribe(data => {

      this.houseService.countHouses(this.search).subscribe(data1 => {
        this.limit = data1.limit;
        this.countHouses = data1.count;
      });

      for (let i = 0; i < data.length; i++) {
        // информация о сотруднике компании
        data[i].user = this.userService.setUser(data[i].user);
        data[i].user.user_information = this.userService.setUserInformation(data[i].user.user_information);
        data[i].company = this.companyService.setCompany(data[i].company);
        data[i].company.company_information = this.companyService.setCompanyInformation(data[i].company.company_information);
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

       // data[i].text = this.regExp(data[i].text);

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

  getSites() {
    this.sites = [];
    return this.siteService.getSites().subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.sites.push(data[i]);
        }
      }
    );
  }

  close_hideme3(event) {
    if (this.activeTypes === event) {
      this.hideme3[event] = false;
      this.activeTypes = null;
    } else {
      this.hideme3[this.activeTypes] = false;
      this.hideme3[event] = true;
      this.activeTypes = event;
    }
  }

  delete(house: House): void {
    this.houseService.delete(house).subscribe(
      data => {
        if (data) {

          if (data.house.delete_moderation)  {
            this.message('Объект отправлен в удаленные', false);
            this.sharedService.emitChange4(); // обновление модерации в меню
          } else {
            this.message('Объект успешно удален', false);
          }

          this.hideme3 = []; // скрыть окно действий
          this.count_delete++;
          if (this.count_delete > 5) {// перезагрузить объекты, если удалено больше 5 подряд
            this.getHouses();
          } else {
            this.houses = this.houses.filter(m => m !== house);
          }
        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.route.navigate(['/']);
        }
        if (error.status === 403) {
          this.route.navigate(['/403']);
        }
      }
    );
  }

  saveReclame(house: House) {

    this.houseService.saveReclame(house).subscribe(
      data => {
        if (data) {
          this.message('Реклама обновлена', false);
          this.hideme3 = []; // скрыть окно действий
        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.route.navigate(['/']);
        }
        if (error.status === 403) {
          this.route.navigate(['/403']);
        }
      }
    );
  }

  openDialog(house: House) {
    const dialogRef = this.dialog.open(DialogDeleteHouseComponent, {
      height: '150px',
      width: '250px',
      data: {house: house}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(result);
      }
    });
  }

  openDialogReclame(house: House) {
    const dialogRef = this.dialog.open(DialogReclameHouseComponent, {
      height: '650px',
      width: '700px',
      data: {house: house, sites: this.sites}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveReclame(result);
      }
    });
  }

  openCalculator(house: House) {
    const dialogRef = this.dialog.open(CalculatorComponent, {
      height: '280px',
      width: '600px',
      data: {price: house.price}
    });
  }
}

@Component({
  selector: 'app-dialog-delete-house',
  templateUrl: 'app-dialog-delete-house.html',
})
export class DialogDeleteHouseComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteHouseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-dialog-reclame-house',
  templateUrl: 'app-dialog-reclame-house.html',
})
export class DialogReclameHouseComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogReclameHouseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
