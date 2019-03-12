import {Component, OnInit} from '@angular/core';
import {UserInformation} from '../../_models/UserInformation.model';
import {User} from '../../_models/User.model';
import {SharedService} from '../../_services/shared.service';
import {UserService} from '../../_services/user.service';
import {LoginService} from '../../_services/login.service';
import {CompanyService} from '../../_services/company.service';
import {Router} from '@angular/router';
import {Company} from '../../_models/Company.model';

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.css']
})
export class PartnerListComponent implements OnInit {

  public user_information: UserInformation = new UserInformation(null, '', '', '', '', '', '', null, []);
  public users: User[] = [];
  public companies: Company[] = [];
  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, null);

  public search = {
    'phone': '',
    'company': '',
    'partner': 1
  };
  public timer: any;

  constructor(private router: Router,
              private userService: UserService,
              private loginService: LoginService,
              private companyService: CompanyService,
              private sharedService: SharedService) {
  }

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
      if (data.user.partner === 1) {
        this.getUsers();
        this.getCompanies();
      } else {
        this.router.navigate(['/403']);
      }

    });
  }

  getUsers() {
    return this.userService.getUsersWithoutAccess(this.search).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].user_information === null) {
            data[i].user_information = this.user_information;
          }
          if (data[i].company === null) {
            data[i].company = this.company;
          }
          this.users.push(data[i]);
          //  console.log(this.users);
        }
      }
     );
  }

  getUsersSearch() {
    this.users = [];
    this.getUsers();
  }

  getCompanies() {
    this.companyService.getCompanies().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.companies.push(data[i]);
      }
    });
  }
}
