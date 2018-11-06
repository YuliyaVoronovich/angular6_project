import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../../_services/client.service';
import {Client} from '../../_models/client.model';
import {LoginService} from '../../_services/login.service';
import {LocationService} from '../../_services/location.service';
import {UserService} from '../../_services/user.service';
import {Router} from '@angular/router';
import {SharedService} from '../../_services/shared.service';
import {CompanyService} from '../../_services/company.service';
import {SearchClientModel} from '../../_models/searchClient.model';

import {Subscription} from 'rxjs/index';
import {Globals} from '../../_common/globals';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit, OnDestroy {

  public clients: Client[] = [];
  public page = 0;
  public timer: any;
  public countClients; // если не придет информация с API
  public limit; // если не придет информация с API

  public subscription: Subscription;

  public search = new SearchClientModel('', '', {'values': []},
    {'values': []}, '', '', null, null, null,
    null, false);

  public sort = {
    'field' : 'created_at',
    'value' : 'DESC'
  };

  public hideme = [];

  constructor(private clientService: ClientService,
              private route: Router,
              private locationService: LocationService,
              private loginService: LoginService,
              private userService: UserService,
              private companyService: CompanyService,
              private sharedService: SharedService,
              private globals: Globals) {

    this.subscription = sharedService.changeEmitted$2.subscribe(data => {
      this.clients = [];
      this.getClients();
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

    return this.clientService.getClients(this.search).subscribe(data => {

      this.clientService.countClients(this.search).subscribe(data1 => {
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



        // адрес объекта
        data[i].city = this.locationService.setCity(data[i].city);
     //   data[i].districts = this.locationService.setDistrict(data[i].districts);

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
      if (typeof(value) === 'object' ) {
        this.search[key] = JSON.stringify(event[key]);
      } else {
        this.search[key] = event[key];
      }

    }
    this.getClients();
  }

  delete(client: Client): void {

    this.clientService.delete(client).subscribe(
      data => {
        if (data.status === 200) {
          this.message('Клиент удален', false);
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
}
