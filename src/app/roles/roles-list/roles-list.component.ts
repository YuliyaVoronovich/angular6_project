import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {PermissionService} from '../../_services/permission.service';
import {SharedService} from '../../_services/shared.service';
import {RoleService} from '../../_services/role.service';
import {Role} from '../../_models/Role.model';
import {User} from '../../_models/User.model';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css']
})
export class RolesListComponent implements OnInit {

  public roles: Role[] = [];
  public user: User = new User(0, '', '', null, null, null, '',
    0, 0, 0, false, null, null, null, null, null, null);
  public search = {
    'company': ''
  };
  public page = 0;
  public timer: any;

  constructor(private router: Router,
              private permissionService: PermissionService,
              private roleService: RoleService,
              private loginService: LoginService,
              private sharedService: SharedService) { }

  ngOnInit() {
    this.loginService.detailsUser().subscribe(data => {
      this.search['company'] = data.user.company.id;
      this.getRoles();

    });
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  getRoles() {
    return this.roleService.getRoles(this.search).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.roles.push(data[i]);
        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.router.navigate(['/']);
        }
        if (error.status === 403) {
          this.router.navigate(['403']);
        }
        if (error.status === 404) {
          this.router.navigate(['404']);
        }
      });
  }
}
