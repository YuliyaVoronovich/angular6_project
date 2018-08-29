import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../_services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-general-menu',
  templateUrl: './general-menu.component.html',
  styleUrls: ['./general-menu.component.css']
})
export class GeneralMenuComponent implements OnInit {

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
