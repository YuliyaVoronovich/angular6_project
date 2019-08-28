import { Component, OnInit } from '@angular/core';
import {Sale} from '../../_models/Sale.model';
import {Router} from '@angular/router';
import {SaleService} from '../../_services/sale.service';
import {LocationService} from '../../_services/location.service';
import {LoginService} from '../../_services/login.service';
import {User} from '../../_models/User.model';
import {Company} from '../../_models/Company.model';
import {AccessModel} from '../../_models/Access.model';
import {CompanyService} from '../../_services/company.service';
import {UserService} from '../../_services/user.service';
import {SearchSaleModel} from '../../_models/SearchSale.model';

@Component({
  selector: 'app-sales-list-hhos',
  templateUrl: './sales-list-hhos.component.html',
  styleUrls: ['./sales-list-hhos.component.css']
})
export class SalesListHhosComponent implements OnInit {

  public sales: Sale[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);
  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, [], null);

  public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false);

  public hideme = [];

  public page = 0;
  public timer: any;
  public countSales; // если не придет информация с API
  public limit; // если не придет информация с API

  public search = new SearchSaleModel({'values': [], 'except': 0}, {'values': [], 'except': 0}, {'values': [], 'except': 0},
    {'values': [], 'except': 0}, {'values': [], 'except': 0}, {'values': [], 'except': 0}, '', '', null,
    null, null, null, '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '0',
    '0', '', '', '', '', '', '', [], [], [], false, false, false,
    false, false, false, false, false);

  /*public search = {
    'users' : 0,
    'company' : 0
  };*/

  public sort = {
    'field': 'updated_at',
    'value': 'DESC'
  };

  constructor(private route: Router,
              private saleService: SaleService,
              private locationService: LocationService,
              private loginService: LoginService,
              private userService: UserService,
              private companyService: CompanyService) { }

  ngOnInit() {
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.access = data.array_access;
      this.getSales();
    });
  }

  getSales() {

    this.search['sort'] = JSON.stringify(this.sort);

    return this.saleService.getSalesHhos(this.search).subscribe(data => {
      this.sales = [];
      this.saleService.countSalesHhos(this.search).subscribe(data1 => {
        this.limit = data1.limit;
        this.countSales = data1.count;
      });

      for (let i = 0; i < data.length; i++) {
        // информация о сотруднике компании
        data[i].user = this.userService.setUser(data[i].user);
        data[i].user.user_information = this.userService.setUserInformation(data[i].user.user_information);
        data[i].company = this.companyService.setCompany(data[i].company);
        data[i].company.company_information = this.companyService.setCompanyInformation(data[i].company.company_information);
        // console.log(data[i].company.company_information);
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

  getSalesSearch(event) {
    this.sales = [];

    for (const [key, value] of Object.entries(event)) {
      if (typeof(value) === 'object') {
        this.search[key] = JSON.stringify(event[key]);
      } else {
        this.search[key] = event[key];
      }

    }
    this.getSales();
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

}
