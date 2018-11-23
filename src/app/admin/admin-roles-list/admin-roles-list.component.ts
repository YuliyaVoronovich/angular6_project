import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../_services/login.service';
import {Router} from '@angular/router';
import {PermissionService} from '../../_services/permission.service';
import {Role} from '../../_models/Role.model';
import {RoleService} from '../../_services/role.service';
import {CompanyService} from '../../_services/company.service';
import {Company} from '../../_models/Company.model';
import {SharedService} from '../../_services/shared.service';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles-list.component.html',
  styleUrls: ['./admin-roles-list.component.css']
})
export class AdminRolesListComponent implements OnInit {

  public roles: Role[] = [];
  public companies: Company[] = [];
  public search = {
    'company': ''
  };
  public page = 0;
  public timer: any;

  constructor(private router: Router,
              private permissionService: PermissionService,
              private roleService: RoleService,
              private loginService: LoginService,
              private companyService: CompanyService,
              private sharedService: SharedService) {

  }

  ngOnInit() {
    this.getRoles();
    this.getCompanies();
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  getCompanies() {
    this.companyService.getCompanies().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.companies.push(data[i]);
      }
    });
  }

  getRoles() {
    return this.roleService.getRoles(this.search).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          data[i].company = this.companyService.setCompany(data[i].company);
          this.roles.push(data[i]);
        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.router.navigate(['/']);
        }
      });
  }

  getRolesSearch() {
    //  this.page = 0;
    this.roles = [];
    this.search['page'] = this.page;
    this.getRoles();
  //  console.log(this.search);
  }

}
