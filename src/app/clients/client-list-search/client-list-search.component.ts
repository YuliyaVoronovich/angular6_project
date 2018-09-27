import { Component, OnInit } from '@angular/core';
import {IOption} from 'ng-select';
import {LocationService} from '../../_services/location.service';
import {LabelService} from '../../_services/label.service';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';

@Component({
  selector: 'app-client-list-search',
  templateUrl: './client-list-search.component.html',
  styleUrls: ['./client-list-search.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ClientListSearchComponent implements OnInit {

  public regions: Array<IOption> = [
    {label: '', value: ''}
  ];

  public districts_rb: Array<IOption> = [
    {label: '', value: ''}
  ];

  public cities: Array<IOption> = [
    {label: '', value: ''}
  ];

  public districts: Array<IOption> = [
    {label: '', value: ''}
  ];

  constructor(private locationService: LocationService,
              private labelsService: LabelService) { }

  ngOnInit() {
    this.getRegions();
    this.getDistrictsRb();
    this.getCities();
    this.getDistricts();
  }
  getRegions() {
    this.locationService.getRegions().subscribe((options) => {
      this.regions = [];

      for (let i = 0; i < options.length; i++) {
        this.regions.push({label: options[i].title, value: '' + options[i].id});
      }
    });

  }

  getDistrictsRb(region: any = 0) {
    this.locationService.getDistrictsRb(region).subscribe((options) => {
      this.districts_rb = [];

      for (let i = 0; i < options.length; i++) {
        this.districts_rb.push({label: options[i].title, value: '' + options[i].id});

      }
    });
  }

  getCities(region: any = 0, district_rb: any = 0) {
    this.locationService.getCities(region, district_rb).subscribe((options) => {
      this.cities = [];

      for (let i = 0; i < options.length; i++) {
        this.cities.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getDistricts(city: any = 0) {
    this.locationService.getDistricts(city).subscribe((options) => {
      this.districts = [];

      for (let i = 0; i < options.length; i++) {
        this.districts.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

}
