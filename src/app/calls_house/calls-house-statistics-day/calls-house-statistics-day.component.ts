import { Component, OnInit } from '@angular/core';
import {StatisticsCalls} from '../../_models/StatisticsCalls.model';
import {Label} from '../../_models/Label.model';
import {User} from '../../_models/User.model';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {SharedService} from '../../_services/shared.service';
import {LabelService} from '../../_services/label.service';
import {CallHouseService} from '../../_services/call_house.service';

@Component({
  selector: 'app-calls-house-statistics-day',
  templateUrl: './calls-house-statistics-day.component.html',
  styleUrls: ['./calls-house-statistics-day.component.css']
})
export class CallsHouseStatisticsDayComponent implements OnInit {

  public statistics: StatisticsCalls[] = [];
  public sources: Label[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);

  public week = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  constructor(private router: Router,
              private loginService: LoginService,
              private sharedService: SharedService,
              private labelService: LabelService,
              private callHouseService: CallHouseService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['date']) {
        this.loginService.detailsUser().subscribe(data => {
          this.user = data.user;
          // this.getMonth();
          this.getSources();
          this.getStatisticsCalls(params['date']);
        });
      }
    });
  }

  getSources() {
    this.labelService.getAllLabelsHouses().subscribe(data => {
      this.sources = data.sources;
    });

  }

  getStatisticsCalls(date) {
    this.callHouseService.countStatisticsCallsDays(date).subscribe(data => {
      for (let i = 0; i < data.length; i++) {

        this.statistics.push(data[i]);
      }
   //   console.log(this.statistics);
    });

  }

}
