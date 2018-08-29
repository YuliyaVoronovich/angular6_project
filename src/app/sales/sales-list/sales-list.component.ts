import {Component, Inject, Input, OnDestroy, OnInit, Renderer} from '@angular/core';
import {Sale} from '../../_models/sale.model';
import {User} from '../../_models/user.model';
import {SaleService} from '../../_services/sale.service';
import {LoginService} from '../../_services/login.service';
import {Router} from '@angular/router';
import {UserService} from '../../_services/user.service';
import {SharedService} from '../../_services/shared.service';
import { Subscription } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {LocationService} from '../../_services/location.service';

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
    null, null, null, null, '', null, null);

  public hideme = [];
  public hideme2 = [];
  public hideme3 = [];

  public search = {
    'price': '',
    'room': '',
    'sortRoom' : 'desc'
  };

  public page = 0;
  public timer: any;
  public countSales; // если не придет информация с API
  public limit; // если не придет информация с API
  public subscription: Subscription;

  constructor(public dialog: MatDialog,
              private route: Router,
              private saleService: SaleService,
              private locationService: LocationService,
              private loginService: LoginService,
              private userService: UserService,
              private render: Renderer,
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

  add(): void {
    this.route.navigate(['sales/sale']);
  }

  /*  onScroll(): void {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        this.index++;
        console.log(this.index);
        this.getSalesSearch();
      }
    }*/

  getSalesSearch(event) {
    console.log(event);
    this.sales = [];
    this.search = event;
    this.getSales();
  }

  getSalesByPage(page) {
    this.sales = [];
    this.page = page;
    this.search['page'] = this.page - 1;
    this.getSales();
  }

  getSales() {
    return this.saleService.getSales(this.search).subscribe(data => {

      this.saleService.countSales(this.search).subscribe(data1 => {
        this.limit = data1.limit;
        this.countSales = data1.count;
      });

      for (let i = 0; i < data.length; i++) {
        // информация о сотруднике
        data[i].user = this.userService.setUser(data[i].user);
        data[i].user.user_information = this.userService.setUserInformation(data[i].user);
        data[i].user.company = this.userService.setUserCompany(data[i].user);
        //
        // адрес объекта
        data[i].location = this.locationService.setLocation(data[i].location);
        data[i].location.city = this.locationService.setCity(data[i].location);
        data[i].location.district = this.locationService.setDistrict(data[i].location);
        data[i].location.microdistrict = this.locationService.setMicroDistrict(data[i].location);
        data[i].location.street = this.locationService.setStreet(data[i].location);
        data[i].location.metro = this.locationService.setMetro(data[i].location);
        // цена за метр
        if (data[i].area !== 0) {
          data[i].price_sqr = Math.floor(data[i].price / data[i].area);
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

  delete(sale: Sale): void {
  //  this.sales = this.sales.filter(m => m !== sale);
  //  this.sales = [];
    this.saleService.delete(sale).subscribe(
      data => {
        if (data.status === 200) {
          this.message('Квартира удалена', false);
        //  this.getSales();
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
      height: '200px',
      width: '300px',
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
