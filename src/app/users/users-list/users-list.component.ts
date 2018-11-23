import { Component, OnInit } from '@angular/core';
import {UserInformation} from '../../_models/UserInformation.model';
import {Company} from '../../_models/Company.model';
import {User} from '../../_models/User.model';
import {Router} from '@angular/router';
import {UserService} from '../../_services/user.service';
import {SharedService} from '../../_services/shared.service';
import {LoginService} from '../../_services/login.service';
import {CompanyService} from '../../_services/company.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  public user_information: UserInformation = new UserInformation(null, '', '', '', '', '', '', null, []);
  public users: User[] = [];
  public companies: Company[] = [];
  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, null);
  public search = {
    'phone': '',
    'company': ''
  };
  public page = 0;
  public timer: any;

  constructor(private router: Router,
              private userService: UserService,
              private loginService: LoginService,
              private companyService: CompanyService,
              private sharedService: SharedService) { }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  ngOnInit() {
    this.loginService.detailsUser().subscribe(data => {
      this.search['company'] = data.user.company.id;
      this.getUsers();

    });
  }

  getUsers() {
    return this.userService.getUsers(this.search).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].user_information === null) {
            data[i].user_information = this.user_information;
          }
          if (data[i].company === null) {
            data[i].company = this.company;
          }
          this.users.push(data[i]);
        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.router.navigate(['/']);
        }
        if (error.status === 403) {
          this.loginService.logout();
          this.router.navigate(['403']);
        }
      });
  }

  getUsersSearch() {
    //  this.page = 0;
    this.users = [];
    this.search['page'] = this.page;
    this.getUsers();
    // console.log(this.search);
  }

  delete(user: User): void {
    this.users = this.users.filter(m => m !== user);
    this.userService.delete(user).subscribe(
      data => {
        if (data.status === 200) {
          this.message('Пользователь удален', true);
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
}
