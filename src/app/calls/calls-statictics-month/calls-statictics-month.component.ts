import { Component, OnInit } from '@angular/core';
import {Label} from '../../_models/Label.model';
import {SharedService} from '../../_services/shared.service';
import {Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {LabelService} from '../../_services/label.service';
import {User} from '../../_models/User.model';
import {CallService} from '../../_services/call.service';

@Component({
  selector: 'app-statictics-month',
  templateUrl: './calls-statictics-month.component.html',
  styleUrls: ['./calls-statictics-month.component.css']
})
export class CallsStaticticsMonthComponent implements OnInit {

  public sources: Label[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);

  public count;
  public search = {
    'month': 1,
    'source': 1
  };
  public dates = [];

  constructor(private router: Router,
              private loginService: LoginService,
              private sharedService: SharedService,
              private labelService: LabelService,
              private callService: CallService) { }

  ngOnInit() {

    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      this.getMonth();
      this.getSources();
      this.getCountsCalls();

    });
  }

  getSources() {
    this.labelService.getAllLabelsSales().subscribe(data => {
      this.sources = data.sources;
    });
  }

  getCountsCalls() {
    this.callService.countCalls(this.search).subscribe(data => {
      this.count = data.count;
    });
  }

  getMonth() {

  let date = new Date();
    for (let i = 0; i <= 25; i++) {
      date.setMonth(date.getMonth() - i);
      console.log(date);
      const month = date.getMonth();
      console.log(month);
      this.dates.push(month);
      date = new Date();

    }
  }
}
