import {Component, OnInit} from '@angular/core';
import {UserService} from '../../_services/user.service';
import {Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {SharedService} from '../../_services/shared.service';
import {User} from '../../_models/user.model';
import {UserInformation} from '../../_models/userInformation.model';

@Component({
  selector: 'app-menu-user-info',
  templateUrl: './menu-user-info.component.html',
  styleUrls: ['./menu-user-info.component.css']
})
export class MenuUserInfoComponent implements OnInit {

  public user: User = new User(null, '', '', null, null, null, '',
    0, 0, 0, null, null, null, null,  null, null);
  public user_information: UserInformation = new UserInformation(null, '', '', '', '', '', '', null, null);
  public hide = false;
  public hide_info = false;

  public timer: any;

  constructor(private router: Router,
              private userService: UserService,
              private loginService: LoginService,
              private sharedService: SharedService) {
  }

  ngOnInit() {
    this.getUserInfo();
  }

  logout(): boolean {
    this.loginService.logout();
    this.router.navigate(['/']);
    return false;
  }


  getUserInfo() {

    return this.loginService.detailsUser().subscribe(data => {
        this.user = data.user;
        this.user_information = data.user.user_information;
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.router.navigate(['/']);
        }
      });
  }

  setAccess(id) {
    this.user.access = id;
    this.loginService.setAccess(this.user).subscribe(
      data => {
        if (data.status === 200) {
          this.sharedService.emitChange2();
          this.message('Доступ обновлен', false);
          this.hide = false;
          this.hide_info = false;
        } else {
          this.message('Ошибка!', true);
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

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 1000);
  }
}
