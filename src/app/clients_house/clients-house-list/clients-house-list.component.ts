import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ClientHouse} from '../../_models/ClientHouse.model';
import {SearchClientHouseModel} from '../../_models/SearchClientHouse.model';
import {LoginService} from '../../_services/login.service';
import {LocationService} from '../../_services/location.service';
import {UserService} from '../../_services/user.service';
import {Router} from '@angular/router';
import {SharedService} from '../../_services/shared.service';
import {CompanyService} from '../../_services/company.service';
import {ClientHouseService} from '../../_services/client_house.service';

import {Subscription} from 'rxjs/index';
import {Globals} from '../../_common/globals';

import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';



export interface DialogData {
  client: ClientHouse;
}

@Component({
  selector: 'app-clients-house-list',
  templateUrl: './clients-house-list.component.html',
  styleUrls: ['./clients-house-list.component.css']
})
export class ClientsHouseListComponent implements OnInit, OnDestroy {

  public clients: ClientHouse[] = [];
  public page = 0;
  public timer: any;
  public countClients; // если не придет информация с API
  public limit; // если не придет информация с API
  public count_delete = 0;

  public subscription: Subscription;

  public search = new SearchClientHouseModel('', '', {'values': []},
    {'values': []}, {'values': []}, '', [],  0,  null, null, null,
    null, false);

  public sort = {
    'field': 'created_at',
    'value': 'DESC'
  };

  public hideme = [];
  public activeTypes = null;

  constructor(public dialog: MatDialog,
              private clientHouseService: ClientHouseService,
              private route: Router,
              private locationService: LocationService,
              private loginService: LoginService,
              private userService: UserService,
              private companyService: CompanyService,
              private sharedService: SharedService,
              private globals: Globals) {

    this.subscription = sharedService.changeEmitted$2.subscribe(data => {
      this.clients = [];
    //  this.getClients();
    });

  }

  ngOnInit() {
    this.getClients();
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

  getClients() {
    this.search['sort'] = JSON.stringify(this.sort);

    return this.clientHouseService.getClients(this.search).subscribe(data => {

      this.clientHouseService.countClients(this.search).subscribe(data1 => {
        this.limit = data1.limit;
        this.countClients = data1.count;
      });
      for (let i = 0; i < data.length; i++) {
        data[i].user = this.userService.setUser(data[i].user);
        data[i].user.user_information = this.userService.setUserInformation(data[i].user);
        data[i].company = this.companyService.setCompany(data[i].company);

        // телефоны с логотипами
        if (data[i].phone1) {
          data[i].phone1 = this.globals.transformPhone(data[i].phone1);
        }
        if (data[i].phone2) {
          data[i].phone2 = this.globals.transformPhone(data[i].phone2);
        }

        this.clients.push(data[i]);
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

  getClientsByPage(page) {
    this.clients = [];
    this.page = page;
    this.search['page'] = this.page - 1;
    this.getClients();
  }

  changeSort(field, value) {
    this.sort.field = field;
    this.sort.value = value;

    this.clients = [];

    this.getClients();
  }

  getClientsSearch(event) {
    this.clients = [];

    for (const [key, value] of Object.entries(event)) {
      if (typeof(value) === 'object') {
        this.search[key] = JSON.stringify(event[key]);
      } else {
        this.search[key] = event[key];
      }

    }
    this.getClients();
  }

  delete(client: ClientHouse): void {

    this.clientHouseService.delete(client).subscribe(data => {
        if (data.status === 200) {
          this.message('Клиент удален', false);
          this.hideme = []; // скрыть окно действий
          this.count_delete++;
          if (this.count_delete > 5) {// перезагрузить объекты, если удалено больше 5 подряд
            this.getClients();
          } else {
            this.clients = this.clients.filter(m => m !== client);
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

  openDialog(client: ClientHouse) {
    const dialogRef = this.dialog.open(DialogDeleteClientHouseComponent, {
      height: '150px',
      width: '250px',
      data: {client: client}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(result);
      }
    });
  }

  close_hideme(event) {
    if (this.activeTypes === event) {
      this.hideme[event] = false;
      this.activeTypes = null;
    } else {
      this.hideme[this.activeTypes] = false;
      this.hideme[event] = true;
      this.activeTypes = event;
    }
  }
}

@Component({
  selector: 'app-dialog-delete-client-house',
  templateUrl: 'app-dialog-delete-client-house.html',
})
export class DialogDeleteClientHouseComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteClientHouseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
