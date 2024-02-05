import { Component, OnInit } from '@angular/core';
import {Label} from '../../_models/Label.model';
import {SharedService} from '../../_services/shared.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {LabelService} from '../../_services/label.service';
import {StatisticsCalls} from '../../_models/StatisticsCalls.model';
import {CallService} from '../../_services/call.service';
import {User} from '../../_models/User.model';

@Component({
  selector: 'app-statistics-day',
  templateUrl: './calls-statistics-day.component.html',
  styleUrls: ['./calls-statistics-day.component.css']
})
export class CallsStatisticsDayComponent implements OnInit {

  public statistics: StatisticsCalls[] = [];
  public sources: Label[] = [];
  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);

  public week = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  constructor(private router: Router,
              private loginService: LoginService,
              private sharedService: SharedService,
              private labelService: LabelService,
              private callService: CallService,
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
    this.labelService.getAllLabelsSales().subscribe(data => {
      this.sources = data.sources;
    });

  }

  getStatisticsCalls(date) {
    this.callService.countStatisticsCallsDays(date).subscribe(data => {
      for (let i = 0; i < data.length; i++) {

        this.statistics.push(data[i]);
      }
    //  console.log(this.statistics);
    });

  }

}
