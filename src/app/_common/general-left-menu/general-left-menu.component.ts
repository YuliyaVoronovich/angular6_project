import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../_services/login.service';
import {Company} from '../../_models/Company.model';
import {AccessModel} from '../../_models/Access.model';
import {User} from '../../_models/User.model';

@Component({
  selector: 'app-general-left-menu',
  templateUrl: './general-left-menu.component.html',
  styleUrls: ['./general-left-menu.component.css']
})
export class GeneralLeftMenuComponent implements OnInit {

  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, null);

  public user: User = new User(0, '', '', null, null, null, '',
    0, 0, 0, false, null, null, null, null, null, null);

  public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false);

  constructor(  private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.detailsUser().subscribe(data => {
      // this.company = data.user.company;

      this.access = data.array_access;

      this.user = data.user;
     // console.log(this.access);
    });
  }

}
