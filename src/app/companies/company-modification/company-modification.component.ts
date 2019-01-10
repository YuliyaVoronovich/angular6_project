import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Module} from '../../_models/Module.model';
import {NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {LoginService} from '../../_services/login.service';
import {CompanyService} from '../../_services/company.service';
import {Company} from '../../_models/Company.model';
import 'rxjs/add/operator/switchMap';
import {CompanyInformation} from '../../_models/CompanyInformation.model';
import {forEach} from '@angular/router/src/utils/collection';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {User} from '../../_models/User.model';
import {UserInformation} from '../../_models/UserInformation.model';
import {SharedService} from '../../_services/shared.service';

@Component({
  selector: 'app-company-modification',
  templateUrl: './company-modification.component.html',
  styleUrls: ['./company-modification.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class CompanyModificationComponent implements OnInit {

  public modules: Module[] = [];
  public id;

  public timer: any;
  public company_information: CompanyInformation = new CompanyInformation(0, null, '', '', '', '', '',
    '', '', '', false, false, false, false, false, '',
    '', '', '', false, '', '', '', '',
    '', false, '', '', '', '', false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, '', '', '', '');
  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, null);

  public user: User = new User(0, '', '', null, null, null, '', 0, null, null, false,
    null, null, '', null, null, null);
  public user_information: UserInformation = new UserInformation(0, '', '', '', '', '', '', null, []);

  public phone_rent = false;
  public phone_sale = false;
  public phone_house = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private sharedService: SharedService,
              private companySevice: CompanyService) {
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

            this.company = data.company;
            if (this.company.company_information === null) {
              this.company.company_information = this.company_information;
            }
            // даты из формата 0000-00-00 в формат объект
            this.company.license_from = new NgbDateFRParserFormatter().parse(data.company.license_from);
            this.company.license_to = new NgbDateFRParserFormatter().parse(data.company.license_to);
            this.company.modules = data.company.arrayModules;

            if (this.company.company_information.phone_rent) { this.phone_rent = true; }
            if (this.company.company_information.phone_sale) { this.phone_sale = true; }
            if (this.company.company_information.phone_house) { this.phone_house = true; }
          });
        } else {
          this.company.company_information = this.company_information;
        }
      });
    this.company.user = this.user;
    this.company.user.user_information = this.user_information;
  }

  save() {
    console.log(this.company);
    // даты из формата объект в формат 0000-00-00
    this.company.license_from = new NgbDateFRParserFormatter().format_to_base(this.company.license_from);
    this.company.license_to = new NgbDateFRParserFormatter().format_to_base(this.company.license_to);

    if (this.company.id !== null) {
      this.companySevice.update(this.company).subscribe(
        data => {
          if (data.status === 200) {
            this.message('Настройки сохранены', false);

            this.company.license_from = new NgbDateFRParserFormatter().parse('' + this.company.license_from);
            this.company.license_to = new NgbDateFRParserFormatter().parse('' + this.company.license_to);

          } else {
            this.message('Ошибка!', true);

            this.company.license_from = new NgbDateFRParserFormatter().parse('' + this.company.license_from);
            this.company.license_to = new NgbDateFRParserFormatter().parse('' + this.company.license_to);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка!', true);

            this.company.license_from = new NgbDateFRParserFormatter().parse('' + this.company.license_from);
            this.company.license_to = new NgbDateFRParserFormatter().parse('' + this.company.license_to);
          }
        }
      );
    }
  }

}
