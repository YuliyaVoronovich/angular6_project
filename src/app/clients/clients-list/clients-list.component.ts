import { Component, OnInit } from '@angular/core';
import {ClientService} from '../../_services/client.service';
import {Client} from '../../_models/client.model';
import {LoginService} from '../../_services/login.service';
import {LocationService} from '../../_services/location.service';
import {UserService} from '../../_services/user.service';
import {Router} from '@angular/router';
import {SharedService} from '../../_services/shared.service';
import {CompanyService} from '../../_services/company.service';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit {

  public clients: Client[] = [];
  public search;
  public page = 0;
  public timer: any;
  public countClients; // если не придет информация с API
  public limit; // если не придет информация с API

  public hideme = [];

  constructor(private clientService: ClientService,
              private route: Router,
              private locationService: LocationService,
              private loginService: LoginService,
              private userService: UserService,
              private companyService: CompanyService,
              private sharedService: SharedService) {

  }

  ngOnInit() {
    this.getClients();
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
    return this.clientService.getClients(this.search).subscribe(data => {

      this.clientService.countClients(this.search).subscribe(data1 => {
        this.limit = data1.limit;
        this.countClients = data1.count;
      });
      for (let i = 0; i < data.length; i++) {
        data[i].user = this.userService.setUser(data[i].user);
        data[i].user.user_information = this.userService.setUserInformation(data[i].user);
        data[i].company = this.companyService.setCompany(data[i].company);

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

}
