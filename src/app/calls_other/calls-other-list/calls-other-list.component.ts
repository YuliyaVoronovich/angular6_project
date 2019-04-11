import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from '../../_models/User.model';
import {Company} from '../../_models/Company.model';
import {Subscription} from 'rxjs/index';
import {AccessModel} from '../../_models/Access.model';
import {CallOther} from '../../_models/CallOther';
import {Router} from '@angular/router';
import {UserService} from '../../_services/user.service';
import {Globals} from '../../_common/globals';
import {LoginService} from '../../_services/login.service';
import {SharedService} from '../../_services/shared.service';
import {LabelService} from '../../_services/label.service';
import {MatDialog} from '@angular/material';
import {CompanyService} from '../../_services/company.service';
import {CallOtherService} from '../../_services/call_other.service';

@Component({
  selector: 'app-calls-other-list',
  templateUrl: './calls-other-list.component.html',
  styleUrls: ['./calls-other-list.component.css']
})
export class CallsOtherListComponent implements OnInit, OnDestroy {

  public calls: CallOther[] = [];
  public call: CallOther = new CallOther(0, null, null, '', '', '', '', '' ,0,
    null, null);
  public page = 0;
  public timer: any;
  public countClients; // если не придет информация с API
  public limit; // если не придет информация с API
  public editRowId: any;

  public subscription: Subscription;
  public search = {
    'company': ''
  };

  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);
  public company: Company = new Company(null, '', '', '', '', '', null, null, '',
    '', '', null, null, null, [], null, false, [], null);

  public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false);

  public sort = {
    'field': 'created_at',
    'value': 'DESC'
  };

  public hideme = [];
  public activeTypes = null;

  @ViewChild('myInput') inputEl: ElementRef;

  constructor(public dialog: MatDialog,
              private callOtherService: CallOtherService,
              private router: Router,
              private loginService: LoginService,
              private userService: UserService,
              private companyService: CompanyService,
              private labelsService: LabelService,
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
      this.search['company'] = data.user.company.id;
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
    this.search['sort'] = JSON.stringify(this.sort);

    return this.callOtherService.getCalls(this.search).subscribe(data => {

      this.callOtherService.countCalls(this.search).subscribe(data1 => {
        this.limit = data1.limit;
        this.countClients = data1.count;
      });
      for (let i = 0; i < data.length; i++) {
        data[i].user = this.userService.setUser(data[i].user);
        data[i].user.user_information = this.userService.setUserInformation(data[i].user.user_information);
        data[i].company = this.companyService.setCompany(data[i].user.company);

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

  change(call: CallOther) {
    this.save(call);
    this.editRowId = 0;
  }

  save(call: CallOther) {
    console.log(call);

    if (call.id !== 0) {
      this.callOtherService.update(call).subscribe(
        data => {
          if (data) {
            this.message('Звонок обновлен', false);
            this.router.navigate(['calls_other']);
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
