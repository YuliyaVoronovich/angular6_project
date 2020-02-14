import { Component, OnInit } from '@angular/core';
import {CallSale} from '../../_models/CallSale.model';
import {Label} from '../../_models/Label.model';
import {SharedService} from '../../_services/shared.service';
import {Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';
import {LabelService} from '../../_services/label.service';

@Component({
  selector: 'app-statistics-day',
  templateUrl: './calls-statistics-day.component.html',
  styleUrls: ['./calls-statistics-day.component.css']
})
export class CallsStatisticsDayComponent implements OnInit {

  public calls: CallSale[] = [];
  public sources: Label[] = [];

  constructor(private router: Router,
              private loginService: LoginService,
              private sharedService: SharedService,
              private labelService: LabelService) { }

  ngOnInit() {
    this.getSources();
  }

  getSources() {
    this.labelService.getAllLabelsSales().subscribe(data => {
      this.sources = data.sources;
    });

  }

}
