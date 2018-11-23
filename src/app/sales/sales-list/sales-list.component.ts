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
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import {Router} from '@angular/router';

export interface DialogData {
  sale: Sale;
}

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit, OnDestroy {

  public sales: Sale[] = [];
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
  public countSales; // если не придет информация с API
  public limit; // если не придет информация с API

  public count_delete = 0;
  public subscription: Subscription;
  public search = new SearchSaleModel({'values': [], 'except': 0}, {'values': [], 'except': 0}, {
      'values': [],
      'except': 0
    },
    {'values': [], 'except': 0}, {'values': [], 'except': 0}, {'values': [], 'except': 0}, '', '', null,
    null, null, null, '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', [], [], [], false, false, false,
    false, false, false, false);

  public sort = {
    'field': 'created_at',
    'value': 'DESC'
  };


  constructor(public dialog: MatDialog,
              private route: Router,
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
      this.getSales();
    });
  }

  ngOnInit() {
    this.getSales();
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

  /*  onScroll(): void {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        this.index++;
        console.log(this.index);
        this.getSalesSearch();
      }
    }*/

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

  getSales() {
    this.search['sort'] = JSON.stringify(this.sort);

    return this.saleService.getSales(this.search).subscribe(data => {
      this.sales = [];
      this.saleService.countSales(this.search).subscribe(data1 => {
        this.limit = data1.limit;
        this.countSales = data1.count;
      });

      for (let i = 0; i < data.length; i++) {
        // информация о сотруднике компании
        data[i].user = this.userService.setUser(data[i].user);
        data[i].user.user_information = this.userService.setUserInformation(data[i].user);
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

  delete(sale: Sale): void {
    this.saleService.delete(sale).subscribe(
      data => {
        if (data.status === 200) {
          this.message('Объект удален', false);
          this.hideme3 = []; // скрыть окно действий
          this.count_delete++;
          if (this.count_delete > 5) {// перезагрузить объекты, если удалено больше 5 подряд
            this.getSales();
          } else {
            this.sales = this.sales.filter(m => m !== sale);
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

  openDialog(sale: Sale) {
    const dialogRef = this.dialog.open(DialogDeleteSaleComponent, {
      height: '150px',
      width: '250px',
      data: {sale: sale}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(result);
      }
    });
  }
}

@Component({
  selector: 'app-dialog-delete-sale',
  templateUrl: 'app-dialog-delete-sale.html',
})
export class DialogDeleteSaleComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
