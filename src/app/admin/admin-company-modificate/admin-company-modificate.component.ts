import {Component, OnInit} from '@angular/core';
import {ModuleService} from '../../_services/module.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Module} from '../../_models/module.model';
import {NgbDatepickerConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {LoginService} from '../../_services/login.service';
import {CompanyService} from '../../_services/company.service';
import {Company} from '../../_models/company.model';
import 'rxjs/add/operator/switchMap';
import {CompanyInformation} from '../../_models/companyInformation.model';
import {forEach} from '@angular/router/src/utils/collection';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {User} from '../../_models/user.model';
import {UserInformation} from '../../_models/userInformation.model';
import {SharedService} from '../../_services/shared.service';

@Component({
  selector: 'app-admin-company-modificate',
  templateUrl: './admin-company-modificate.component.html',
  styleUrls: ['./admin-company-modificate.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class AdminCompanyModificateComponent implements OnInit {

  public modules: Module[] = [];
  public id;
  public license_from;
  public license_to;
  public timer: any;
  public company_information: CompanyInformation = new CompanyInformation(0, null, '', '', '', '', '');
  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, null);
  public user: User = new User(0, '', '', null, null, null, '', 0, null, null,
    null, null, '', null, null);
  public user_information: UserInformation = new UserInformation(0, '', '', '', '', '', '', null, []);

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private moduleSevice: ModuleService,
              private sharedService: SharedService,
              private companySevice: CompanyService) {
  }


  ngOnInit() {

    this.route
      .params.subscribe(
      params => {
        if (params['id']) {
          this.route.data.subscribe(({data}) => {

            this.company = data.company;
            if (this.company.company_information === null) {
              this.company.company_information = this.company_information;
            }
            // даты из формата 0000-00-00 в формат объект
            this.company.license_from = new NgbDateFRParserFormatter().parse(data.company.license_from);
            this.company.license_to = new NgbDateFRParserFormatter().parse(data.company.license_to);
            this.company.modules = data.company.arrayModules;
            this.modules = data.modules;
          });
        } else {
          this.company.company_information = this.company_information;
          this.create();
        }
      });
    this.company.user = this.user;
    this.company.user.user_information = this.user_information;
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  create() {
    return this.moduleSevice.getModules().subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.modules.push(data[i]);
        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.router.navigate(['/']);
        }
      });
  }

  save() {
    console.log(this.company);
    // даты из формата объект в формат 0000-00-00
    this.license_from = new NgbDateFRParserFormatter().format_to_base(this.company.license_from);
    this.license_to = new NgbDateFRParserFormatter().format_to_base(this.company.license_to);
    this.company.license_from = this.license_from;
    this.company.license_to = this.license_to;

    if (this.company.id !== null) {
      this.companySevice.update(this.company).subscribe(
        data => {
          if (data.status === 200) {
            this.message('Компания была успешно обновлена', false);
            this.router.navigate(['admin/companies']);
          } else {
            this.message('Ошибка обновления компании!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка обновления компании!', true);
          }
        }
      );
    } else {
      this.companySevice.create(this.company).subscribe(
        data => {
          if (data.status === 201) {
            this.message('Компания была успешно добавлена', false);
            this.router.navigate(['admin/companies']);
          } else {
            this.message('Ошибка добавления компании!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка добавления компании!', true);
          }
        }
      );
    }
  }
}
