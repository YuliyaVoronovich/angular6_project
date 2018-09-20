import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../_services/login.service';
import {Router} from '@angular/router';
import {User} from '../../_models/user.model';
import {UserService} from '../../_services/user.service';
import {UserInformation} from '../../_models/userInformation.model';
import {Company} from '../../_models/company.model';
import {CompanyService} from '../../_services/company.service';
import {SharedService} from '../../_services/shared.service';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.css']
})
export class AdminUsersListComponent implements OnInit {

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
              private sharedService: SharedService) {
  }

  ngOnInit() {
    this.getUsers();
    this.getDataForSearch();
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
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
      });
  }

  getDataForSearch() {
    this.companyService.getCompanies().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.companies.push(data[i]);
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
  add(): void {
    this.router.navigate(['admin/users/user']);
  }

  ban(user: User): void {
    this.userService.ban(user).subscribe(
      data => {
        if (data.status === 200) {
          user.ban = 1;
          this.message('Пользователь заблокирован', true);
        } else {
          user.ban = 0;
          this.message('Ошибка!', true);
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

  unban(user: User): void {
    this.userService.unban(user).subscribe(
      data => {
        if (data.status === 200) {
          user.ban = 0;
          this.message('Пользователь разблокирован', false);
        } else {
          user.ban = 1;
          this.message('Ошибка!', true);
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

  delete(user: User): void {
    this.users = this.users.filter(m => m !== user);
    this.userService.delete(user).subscribe(
      data => {
        if (data.status === 200) {
          this.message('Пользователь удален', true);
          //  this.router.navigate(['admin/companies']);
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
