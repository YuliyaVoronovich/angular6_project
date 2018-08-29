import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../_services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {

  constructor(private route: Router,
              private loginService: LoginService) {
  }

  ngOnInit() {
  }

  logout(): boolean {
    this.loginService.logout();
    this.route.navigate(['/']);
    return false;
  }

}
