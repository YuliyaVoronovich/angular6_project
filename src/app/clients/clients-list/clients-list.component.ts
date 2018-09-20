import { Component, OnInit } from '@angular/core';
import {ClientService} from '../../_services/client.service';
import {Client} from '../../_models/client.model';
import {LoginService} from '../../_services/login.service';
import {LocationService} from '../../_services/location.service';
import {UserService} from '../../_services/user.service';
import {Router} from '@angular/router';

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

  constructor(private clientService: ClientService,
              private route: Router,
              private locationService: LocationService,
              private loginService: LoginService,
              private userService: UserService) {

  }

  ngOnInit() {
    this.getClients();
  }

  getClients() {
    return this.clientService.getClients(this.search).subscribe(data => {

      this.clientService.countClients(this.search).subscribe(data1 => {
        this.limit = data1.limit;
        this.countClients = data1.count;
      });
      for (let i = 0; i < data.length; i++) {
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

}
