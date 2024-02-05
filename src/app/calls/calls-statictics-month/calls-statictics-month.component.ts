import { Component, OnInit } from '@angular/core';
import {SharedService} from '../../_services/shared.service';
import {Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {User} from '../../_models/User.model';
import {CallService} from '../../_services/call.service';
import {StatisticsCalls} from '../../_models/StatisticsCalls.model';
import {SourceService} from '../../_services/source.service';
import {Source} from '../../_models/Source.model';

@Component({
  selector: 'app-statictics-month',
  templateUrl: './calls-statictics-month.component.html',
  styleUrls: ['./calls-statictics-month.component.css']
})
export class CallsStaticticsMonthComponent implements OnInit {

  public sources: Source[] = [];
  public statistics: StatisticsCalls[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);

  constructor(private router: Router,
              private loginService: LoginService,
              private sharedService: SharedService,
              private sourceService: SourceService,
              private callService: CallService) { }

  ngOnInit() {

    this.loginService.detailsUser().subscribe(data => {
      this.user = data.user;
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
    this.callService.countStatisticsCallsMonths().subscribe(data => {
      for (let i = 0; i < data.statistics.length; i++) {
        this.statistics.push(data.statistics[i]);
      }
      for (let i = 0; i < data.sources.length; i++) {
        this.sources.push(data.sources[i]);
      }
     // console.log(this.statistics);
    }, error => {
      if (error.status === 403) {
        this.router.navigate(['403']);
      }
    });

    /*getMonth() {

    let arr: StatisticsCalls[] = [];
    for (let d = 0; d < 25; d++) {
      let date = new Date();
      let count_month = this.getCountMonth();
      arr.push({date: new Date(date.setMonth(date.getMonth() - d)), count: '0', persent: '0'});
    }
    console.log(arr);
    // let tempDate = arr[10].date;
    // console.log(new Date(tempDate.getFullYear(), tempDate.getMonth(), 0).getDate());
  }*/
  }

}
