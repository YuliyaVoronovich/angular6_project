import { Component, OnInit } from '@angular/core';
import {StatisticsCalls} from '../../_models/StatisticsCalls.model';
import {User} from '../../_models/User.model';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {SharedService} from '../../_services/shared.service';
import {CallHouseService} from '../../_services/call_house.service';
import {SourceService} from '../../_services/source.service';
import {Source} from '../../_models/Source.model';

@Component({
  selector: 'app-calls-house-statistics-day',
  templateUrl: './calls-house-statistics-day.component.html',
  styleUrls: ['./calls-house-statistics-day.component.css']
})
export class CallsHouseStatisticsDayComponent implements OnInit {

  public statistics: StatisticsCalls[] = [];
  public sources: Source[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);

  public week = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  constructor(private router: Router,
              private loginService: LoginService,
              private sharedService: SharedService,
              private sourceService: SourceService,
              private callHouseService: CallHouseService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['date']) {
        this.loginService.detailsUser().subscribe(data => {
          this.user = data.user;

          this.getStatisticsCalls(params['date']);
        //  this.getSources();
        });
      }
    });
  }

  /*getSources() {

    return this.sourceService.getSources().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.sources.push(data[i]);
      }
    });
  }*/

  getStatisticsCalls(date) {
    this.callHouseService.countStatisticsCallsDays(date).subscribe(data => {
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
