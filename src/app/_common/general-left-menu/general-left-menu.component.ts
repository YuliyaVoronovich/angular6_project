import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../_services/login.service';
import {Company} from '../../_models/Company.model';
import {AccessModel} from '../../_models/Access.model';

@Component({
  selector: 'app-general-left-menu',
  templateUrl: './general-left-menu.component.html',
  styleUrls: ['./general-left-menu.component.css']
})
export class GeneralLeftMenuComponent implements OnInit {

  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, null);

  public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false);

  constructor(  private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.detailsUser().subscribe(data => {
      this.company = data.user.company;

      this.access = data.array_access;
     // console.log(this.access);
    });
  }

}
