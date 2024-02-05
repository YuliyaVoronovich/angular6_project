import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LocationService} from '../../_services/location.service';
import {SharedService} from '../../_services/shared.service';
import {LoginService} from '../../_services/login.service';
import {Globals} from '../../_common/globals';
import {UserService} from '../../_services/user.service';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {CompanyService} from '../../_services/company.service';
import {CallService} from '../../_services/call.service';
import {Subscription} from 'rxjs/index';
import {Company} from '../../_models/Company.model';
import {User} from '../../_models/User.model';
import {AccessModel} from '../../_models/Access.model';
import {CallSale} from '../../_models/CallSale.model';
import {SaleService} from '../../_services/sale.service';
import {SearchCallModel} from '../../_models/SearchCall.model';
import {SourceService} from '../../_services/source.service';

@Component({
  selector: 'app-calls-list',
  templateUrl: './calls-list.component.html',
  styleUrls: ['./calls-list.component.css']
})
export class CallsListComponent implements OnInit, OnDestroy {

  public calls: CallSale[] = [];
  public page = 0;
  public timer: any;
  public countClients; // если не придет информация с API
  public limit; // если не придет информация с API
  public editRowId: any;

  public subscription: Subscription;
  /*public search_user = {
    'company': ''
  };
*/
  public search = new SearchCallModel('', '', {'values': []},
    {'values': []}, '', '', null, null, null,
    null, '', 0);

  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);
  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, [], null);

  public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false,false);

  public sort = {
    'field': 'created_at',
    'value': 'DESC'
  };

  public hideme = [];
  public activeTypes = null;

  @ViewChild('myInput') inputEl: ElementRef;

  constructor(public dialog: MatDialog,
              private callService: CallService,
              private router: Router,
              private locationService: LocationService,
              private loginService: LoginService,
              private userService: UserService,
              private companyService: CompanyService,
              private saleService: SaleService,
              private sourceService: SourceService,
              private sharedService: SharedService,
              private globals: Globals) {

    this.subscription = sharedService.changeEmitted$2.subscribe(data => {
      this.calls = [];
      this.user = data;
      this.getCalls();
    });

  }

  ngOnInit() {
    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.access = data.array_access;
      this.getCalls();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  getCalls() {

    this.search['company'] = this.user.company.id;
    this.search['sort'] = JSON.stringify(this.sort);

    return this.callService.getCalls(this.search).subscribe(data => {

      this.callService.countCalls(this.search).subscribe(data1 => {
        this.limit = data1.limit;
        this.countClients = data1.count;
      });
      for (let i = 0; i < data.length; i++) {
        data[i].user = this.userService.setUser(data[i].user);
        data[i].user.user_information = this.userService.setUserInformation(data[i].user.user_information);
        data[i].company = this.companyService.setCompany(data[i].user.company);
        // объект
        data[i].sale = this.saleService.setSale(data[i].sale);
        // адрес объекта
        data[i].sale.location = this.locationService.setLocation(data[i].sale.location);
        data[i].sale.location.city = this.locationService.setCity(data[i].sale.location.city);
        data[i].sale.location.district = this.locationService.setDistrict(data[i].sale.location.district);
        data[i].sale.location.microdistrict = this.locationService.setMicroDistrict(data[i].sale.location.microdistrict);
        data[i].sale.location.street = this.locationService.setStreet(data[i].sale.location.street);

        // sources
        data[i].source = this.sourceService.setSource(data[i].source);

        if (data[i].description) {
          data[i].description = data[i].description.replace('нестандартные примечания от клиента', '');
        }

        this.calls.push(data[i]);
      }

    }, error => {
      if (error.status === 401) {
        this.loginService.logout();
        this.router.navigate(['/']);
      }
      if (error.status === 403) {
        this.router.navigate(['403']);
      }
    });
  }

  getCallsByPage(page) {
    this.calls = [];
    this.page = page;
    this.search['page'] = this.page - 1;
    this.getCalls();
  }

  changeSort(field, value) {
    this.sort.field = field;
    this.sort.value = value;

    this.calls = [];

    this.getCalls();
  }

  getCallsSearch(event) {
    this.calls = [];

    for (const [key, value] of Object.entries(event)) {
      if (typeof(value) === 'object') {
        this.search[key] = JSON.stringify(event[key]);
      } else {
        this.search[key] = event[key];
      }

    }
    this.getCalls();
  }

  toggle(id) {
    this.editRowId = id;
    setTimeout(() => this.inputEl.nativeElement.focus(), 0);
  }

  change(call: CallSale) {
    this.save(call);
    this.editRowId = 0;
  }

  save(call: CallSale) {
    console.log(call);

    if (call.id !== 0) {
      this.callService.update(call).subscribe(
        data => {
          if (data) {
            this.message('Звонок обновлен', false);
            this.router.navigate(['calls']);
          } else {
            this.message('Ошибка!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка!', true);
          }
        }
      );
    }
  }
}
