import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../_services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public login = '';
  public password = '';
  public message = '';

  constructor(private route: Router,
              private logService: LoginService) {
  }

  ngOnInit() {
    if (this.logService.isLoggedIn()) {
      this.route.navigate(['sales']);
    }
  }

  logIn() {
    this.logService.doLogin(this.login, this.password).subscribe(
      data => {
       this.route.navigate(['sales']);
      },
      error => {
        if (error.status === 401) {
          this.message = 'Неправильный логин или пароль!';
        }
        if (error.status === 403) {
          this.message = 'Доступ закрыт!';
        }
      });
  }

}
