import {Component, OnInit} from '@angular/core';
import {NgbDatepickerConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {LoginService} from '../../_services/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../_services/user.service';
import {User} from '../../_models/User.model';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {Company} from '../../_models/Company.model';
import {Role} from '../../_models/Role.model';
import {CompanyService} from '../../_services/company.service';
import {UserInformation} from '../../_models/UserInformation.model';
import {Permission} from '../../_models/Permission.model';
import {RoleService} from '../../_services/role.service';
import {SharedService} from '../../_services/shared.service';
import {FileHolder} from 'angular2-image-upload';
import {Photo} from '../../_models/Photo.model';
import {ImageService} from '../../_services/image.service';
import {PermissionService} from '../../_services/permission.service';

@Component({
  selector: 'app-user-modificate',
  templateUrl: './user-modificate.component.html',
  styleUrls: ['./user-modificate.component.css']
})
export class UserModificateComponent implements OnInit {

  public companies: Company[] = [];
  public users: User[] = [];
  public roles: Role[] = [];
  public permissions: Permission[] = [];
  public user: User = new User(0, '', '', null, null, null, '',
    0, 0, 0, false, null, null, null, null, null, null);
  public user_information: UserInformation = new UserInformation(0, '', '', '', '', '', '', null, null);
  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, [], null);
  public date_of_birth;
  public timer: any;

  public hideme = [];
  public images: Photo [] = [];
  public upload_photo = [];

  public search = {
    'company': ''
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private userService: UserService,
              private sharedService: SharedService,
              private roleService: RoleService,
              private permissionService: PermissionService,
              private imageService: ImageService,
              private companyService: CompanyService) {
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
          this.route.data.subscribe(({data}) => {
            this.user = data.user;
            this.user.user_information.date_of_birth = new NgbDateFRParserFormatter().parse(data.user.user_information.date_of_birth);

            for (let i = 0; i < this.user.user_information.photo.length; i++) {
              this.upload_photo.push(this.user.user_information.photo[i].path);
              //  console.log(this.upload_photo);
            }
            this.user.company = data.user.company;
          });
        } else {
          this.user.user_information = this.user_information;
          this.user.company = this.companyService.setCompany(null);
        }
      });
    this.loginService.detailsUser().subscribe(data => {
      this.search['company'] = data.user.company.id;
      this.getUsers();
      this.getRoles();
      this.getPermissions();
    });
  }

  permissionTrigger(value: string, id: number) {
    this.user.permissions[id] = value;
    // console.log(this.user.permissions[id] + '///' + id);
  }

  getUsers() {
    return this.userService.getUsers(this.search).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].user_information === null) {
          data[i].user_information = this.user_information;
        }
        this.users.push(data[i]);
      }
    });
  }

  getPermissions() {
    return this.permissionService.getPermissions().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.permissions.push(data[i]);
      }
    });
  }

  getRoles() {
    return this.roleService.getRoles(this.search).subscribe(data => {
      this.roles = [];
      for (let i = 0; i < data.length; i++) {
        this.roles.push(data[i]);
      }
    });
  }

  onUploadFinished(file: FileHolder) {
    const im = new Photo(file.src, '', '');
    this.upload_photo.push(im.path);
    this.user.user_information.photo = this.upload_photo;
    //  console.log(this.upload_photo);
  }

  onRemoved(file: FileHolder) {
    const index: number = this.upload_photo.indexOf(file.src);

    // удаление фотографии на сервере
    this.imageService.delete(file.src).subscribe(
      data => {
        if (data.status === 200) {
          if (index !== -1) {
            this.upload_photo.splice(index, 1);
          }
        }
      },
      error => {
      }
    );
    //  console.log(this.upload_photo);
    this.user.user_information.photo = this.upload_photo;
  }

  save() {
    console.log(this.user);
    // даты из формата объект в формат 0000-00-00
    this.date_of_birth = new NgbDateFRParserFormatter().format_to_base(this.user.user_information.date_of_birth);
    this.user.user_information.date_of_birth = this.date_of_birth;
    this.user.user_information.photo = this.upload_photo;

    if (this.user.id !== 0) {
      this.userService.update(this.user).subscribe(
        data => {
          if (data.status === 200) {
            this.message('Пользователь был успешно обновлен', false);
            this.router.navigate(['users']);
          } else {
            this.message('Пользователя не удалось обновить!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка!', true);
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
      this.userService.create(this.user).subscribe(
        data => {
          if (data.status === 201) {
            this.message('Пользователь был успешно добавлен', false);
            this.router.navigate(['users']);
          } else {
            this.message('Пользователя не удалось добавить!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка!', true);
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
