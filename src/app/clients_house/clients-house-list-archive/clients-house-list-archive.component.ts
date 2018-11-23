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

@Component({
  selector: 'app-clients-house-list-archive',
  templateUrl: './clients-house-list-archive.component.html',
  styleUrls: ['./clients-house-list-archive.component.css']
})
export class ClientsHouseListArchiveComponent implements OnInit, OnDestroy {

  public clients: ClientHouse[] = [];
  public page = 0;
  public timer: any;
  public countClients; // если не придет информация с API
  public limit; // если не придет информация с API
  public count_delete = 0;

  public subscription: Subscription;

  public search = new SearchClientHouseModel('', '', {'values': []},
    {'values': []}, {'values': []}, '', [],  0,  null, null,
    null, null, false);

  public sort = {
    'field': 'created_at',
    'value': 'DESC'
  };

  public hideme = [];
  public activeTypes = null;

  constructor(private clientHouseService: ClientHouseService,
              private router: Router,
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

    return this.clientHouseService.getClientsArchive(this.search).subscribe(data => {

      this.clientHouseService.countClientsArchive(this.search).subscribe(data1 => {
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
        this.router.navigate(['/']);
      }
      if (error.status === 403) {
        this.router.navigate(['403']);
      }
      if (error.status === 404) {
        this.router.navigate(['404']);
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
          this.router.navigate(['/']);
        }
        if (error.status === 403) {
          this.router.navigate(['/403']);
        }
      }
    );
  }

  restore(client) {

    if (client.id !== 0) {
      this.clientHouseService.restoreClient(client).subscribe(
        data => {
          if (data) {
            this.message('Клиент восстановлен', false);
            this.clients = this.clients.filter(m => m !== client);
          } else {
            this.message('Не удалось восстановить клиента!', true);
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
}
