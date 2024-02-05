import { Component, OnInit } from '@angular/core';
import {Label} from '../../_models/Label.model';
import {StatisticsCalls} from '../../_models/StatisticsCalls.model';
import {User} from '../../_models/User.model';
import {Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {SharedService} from '../../_services/shared.service';
import {LabelService} from '../../_services/label.service';
import {CallHouseService} from '../../_services/call_house.service';

@Component({
  selector: 'app-calls-house-statistics-month',
  templateUrl: './calls-house-statistics-month.component.html',
  styleUrls: ['./calls-house-statistics-month.component.css']
})
export class CallsHouseStatisticsMonthComponent implements OnInit {

  public sources: Label[] = [];
  public statistics: StatisticsCalls[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);


  constructor(private router: Router,
              private loginService: LoginService,
              private sharedService: SharedService,
              private labelService: LabelService,
              private callHouseService: CallHouseService) { }

  ngOnInit() {

    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      // this.getMonth();
      this.getSources();
      this.getStatisticsCalls();

    });
  }

  getSources() {
    this.labelService.getAllLabelsHouses().subscribe(data => {
      this.sources = data.sources;
    });
  }

  getStatisticsCalls() {
    this.callHouseService.countStatisticsCallsMonths().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.statistics.push(data[i]);
      }
   //   console.log(this.statistics);
    });
  }

}
