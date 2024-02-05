import { Component, OnInit } from '@angular/core';
import {StatisticsCalls} from '../../_models/StatisticsCalls.model';
import {User} from '../../_models/User.model';
import {Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {SharedService} from '../../_services/shared.service';
import {CallHouseService} from '../../_services/call_house.service';
import {SourceService} from '../../_services/source.service';
import {Source} from '../../_models/Source.model';

@Component({
  selector: 'app-calls-house-statistics-month',
  templateUrl: './calls-house-statistics-month.component.html',
  styleUrls: ['./calls-house-statistics-month.component.css']
})
export class CallsHouseStatisticsMonthComponent implements OnInit {

  public sources: Source[] = [];
  public statistics: StatisticsCalls[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);


  constructor(private router: Router,
              private loginService: LoginService,
              private sharedService: SharedService,
              private sourceService: SourceService,
              private callHouseService: CallHouseService) { }

  ngOnInit() {

    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
      // this.getMonth();
      this.getStatisticsCalls();
     // this.getSources();

    });
  }

  /*getSources() {

    return this.sourceService.getSources().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.sources.push(data[i]);
      }
    });
  }*/

  getStatisticsCalls() {
    this.callHouseService.countStatisticsCallsMonths().subscribe(data => {
      for (let i = 0; i < data.statistics.length; i++) {
        this.statistics.push(data.statistics[i]);
      }
      for (let i = 0; i < data.sources.length; i++) {
        this.sources.push(data.sources[i]);
      }
   //   console.log(this.statistics);
    }, error => {
      if (error.status === 403) {
        this.router.navigate(['403']);
      }
    });
  }

}
