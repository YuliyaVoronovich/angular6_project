import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {SharedService} from '../../_services/shared.service';
import {RoleService} from '../../_services/role.service';
import {Permission} from '../../_models/Permission.model';
import {Role} from '../../_models/Role.model';
import {PermissionService} from '../../_services/permission.service';

/* Фильтр по категории привилегий admin*/
@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(permissions: any[]): any {
    if (!permissions) {
      return permissions;
    }
      return permissions.filter(item => item.category !== 'admin');
  }
}

@Component({
  selector: 'app-role-modificate',
  templateUrl: './role-modificate.component.html',
  styleUrls: ['./role-modificate.component.css']
})
export class RoleModificateComponent implements OnInit {

  public role: Role = new Role(0, '', null, []);
  public permissions: Permission[] = [];
  public timer: any;

  public array_permission_selects = [31, 32, 33, 34];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private sharedService: SharedService,
              private roleSevice: RoleService,
              private permissionService: PermissionService) {
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
    this.route
      .params.subscribe(
      params => {
        if (params['id']) {
          this.roleSevice.getRole(params['id']).subscribe(
            data => {
              this.role = data.role;
              this.permissions = data.permissions;
            },
            error => {
              if (error.status === 401) {
                this.router.navigate(['']);
              }
              if (error.status === 404) {
                this.router.navigate(['404']);
              }
              if (error.status === 403) {
                this.router.navigate(['403']);
              }
            }
          );
        } else {
          this.addPermissions();
        }
      });
  }
  provePermission (permission) {
    return this.array_permission_selects.includes(permission);
  }
  onChange(value, permissions) {
    if (value !== '0') {
      this.role.array_permissions[value].check = true;
    } else {
      // снять все check у данной привиллегии
      for (let i = 0; i < permissions.length; i++) {
        this.role.array_permissions[permissions[i].id].check = false;
      }
    }
  }

  addPermissions() {
    this.permissionService.addPermissions().subscribe(
      data => {
        this.permissions = data.permissions;
        this.role.array_permissions = data.role.array_permissions;
      },
      error => {
        if (error.status === 401) {
          this.router.navigate(['']);
        }
        if (error.status === 404) {
          this.router.navigate(['404']);
        }
        if (error.status === 403) {
          this.router.navigate(['403']);
        }
      });
  }

  save() {
    // console.log(this.role);
    if (this.role.id !== 0) {
      this.roleSevice.update(this.role).subscribe(
        data => {
          clearTimeout(this.timer);
          if (data.status === 200) {
            this.message('Роль была успешно обновлена', false);
            this.router.navigate(['roles']);
          } else {
            this.message('Ошибка обновления роли!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          }
          if (error.status === 404) {
            this.router.navigate(['404']);
          }
          if (error.status === 403) {
            this.router.navigate(['403']);
          }
        }
      );
    } else {
      this.roleSevice.create(this.role).subscribe(
        data => {
          clearTimeout(this.timer);
          if (data.status === 201) {
            this.message('Роль была успешно обавлена', false);
            this.router.navigate(['roles']);
          } else {
            this.message('Ошибка добавления роли!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          }
          if (error.status === 404) {
            this.router.navigate(['404']);
          }
          if (error.status === 403) {
            this.router.navigate(['403']);
          }
        }
      );
    }
  }

}
