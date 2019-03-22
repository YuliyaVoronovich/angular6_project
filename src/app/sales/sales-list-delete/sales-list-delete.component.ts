import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Sale} from '../../_models/Sale.model';
import {User} from '../../_models/User.model';
import {Company} from '../../_models/Company.model';
import {SaleService} from '../../_services/sale.service';
import {LoginService} from '../../_services/login.service';
import {SearchSaleModel} from '../../_models/SearchSale.model';

import {CompanyService} from '../../_services/company.service';
import {UserService} from '../../_services/user.service';
import {SharedService} from '../../_services/shared.service';
import {LocationService} from '../../_services/location.service';

import {Subscription} from 'rxjs';

import {Router} from '@angular/router';
import {AccessModel} from '../../_models/Access.model';

@Component({
  selector: 'app-sales-list-delete',
  templateUrl: './sales-list-delete.component.html',
  styleUrls: ['./sales-list-delete.component.css']
})
export class SalesListDeleteComponent implements OnInit, OnDestroy {

  public sales: Sale[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);
  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, [], null);

  public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false);

  public hideme = [];

  public page = 0;
  public timer: any;
  public countSales; // если не придет информация с API
  public limit; // если не придет информация с API

  public subscription: Subscription;
  public search = {};

  public sort = {
    'field': 'updated_at',
    'value': 'ASC'
  };


  constructor(private route: Router,
              private saleService: SaleService,
              private locationService: LocationService,
              private loginService: LoginService,
              private userService: UserService,
              private companyService: CompanyService,
              private sharedService: SharedService) {
    /* this.render.listenGlobal('window', 'scroll', (evt) => {
       this.onScroll();
     });*/
    this.subscription = sharedService.changeEmitted$2.subscribe(data => {
      this.sales = [];
      this.user = data;
      this.getSales();
    });
  }

  ngOnInit() {
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.access = data.array_access;
      this.getSales();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  changeSort(field, value) {
    this.sort.field = field;
    this.sort.value = value;

    this.sales = [];

    this.getSales();
  }

  getSalesByPage(page) {
    this.sales = [];
    this.page = page;
    this.search['page'] = this.page - 1;
    this.getSales();
  }

  getSales() {
    this.search['sort'] = JSON.stringify(this.sort);

    return this.saleService.getSalesDelete(this.search).subscribe(data => {
      this.sales = [];
      this.saleService.countSalesDelete(this.search).subscribe(data1 => {
        this.limit = data1.limit;
        this.countSales = data1.count;
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
        data[i].location.district = this.locationService.setDistrict(data[i].location.district);
        data[i].location.microdistrict = this.locationService.setMicroDistrict(data[i].location.microdistrict);
        data[i].location.street = this.locationService.setStreet(data[i].location.street);
        data[i].location.metro = this.locationService.setMetro(data[i].location.metro);
        // цена за метр
        if (data[i].area !== null && data[i].area !== 0) {
          data[i].price_sqr = Math.floor(+data[i].price / +data[i].area);
        } else {
          data[i].price_sqr = 0;
        }
        //
        this.sales.push(data[i]);
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

