import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {RoleService} from '../../_services/role.service';
import {SharedService} from '../../_services/shared.service';
import {Role} from '../../_models/Role.model';
import {Permission} from '../../_models/Permission.model';

@Component({
  selector: 'app-admin-role-modificate',
  templateUrl: './admin-role-modificate.component.html',
  styleUrls: ['./admin-role-modificate.component.css']
})
export class AdminRoleModificateComponent implements OnInit {

  public role: Role = new Role(0, '', null, []);
  public permissions: Permission[] = [];
  public timer: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private sharedService: SharedService,
              private roleSevice: RoleService) {
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
            }
          );
        } else {

        }
      });
  }

  setAccessMain(role_now, item) {

    if (item.title === 'Доступ к разделу') {
      if (role_now.check) {
        const map = new Map(Object.entries(this.role.array_permissions));
        map.forEach((keys: any, value: any) => {
          if (keys.section === item.section) {// из того же раздела чекбоксы

            role_now.check = true; // вернуть клик у  Доступа (временное решение)
            keys.check = false;

          }
        });
      }
    }
    role_now.check = !role_now.check;
  }

  save() {
    console.log(this.role);
    if (this.role.id !== 0) {
      this.roleSevice.update(this.role).subscribe(
        data => {
          clearTimeout(this.timer);
          if (data.status === 200) {
            this.message('Роль была успешно обновлена', false);
            this.router.navigate(['admin/roles']);
          } else {
            this.message('Ошибка обновления роли!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          }
        }
      );
    }
  }


}
